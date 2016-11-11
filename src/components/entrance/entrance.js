(function() {
  'use strict';

  require('./entrance.scss');

  var _ = require("underscore");
  var Bucks = require('bucks');

  var utils = require("../../utils.js");
  var api = require("../../api.js");
  var shared = require("../../shared.js");
  var storage = require("../../storage.js");


  var entranceComponent = {
    template: require("./entrance.jade")(),

    data: function() {
      return {
        previousInput: null,
        resWaiting:    true,
        currentView:   1,
        username:      null,
        message:       null,
        error:         false,
        faces:         []
      };
    },

    watch: {
      "username": function() {
        this.previousInput = this.username;
      }
    },

    ready: function() {
      var _this = this;

      api.pingRequest().then(function(res) {
        _this.resWaiting = false;
        Vue.nextTick(function() {
          $(_this.$el).find("input.login-field").focus();
        });
      }, function() {
        shared.jumpers.error();
      });

      console.info("[APP] Entrance ready.");
    },

    methods: {
      attrFaceAsset: utils.attrFaceAsset,

      selectFace: function(face) {
        this.currentView = 3;
        api.createNewUser(this.username, face).then(function(res) {
          if (!res.data.room_id) {
            // TODO Better to show an error detail here
            console.warn("Response data does not have room_id");
            shared.jumpers.error();
            return;
          }
          storage.set("token", res.data.token);
          shared.data.currentRoomId = res.data.room_id.$oid;
          shared.data.user = res.data;
          shared.jumpers.root();
        }).catch(function(res) {
          // TODO Need error handling
        });
      },

      enterRobby: function() {
        if (!this.username) {
          error("ログインネームを入力してください");
          return;
        }

        // Vue.js catches enter with IME on, so to prevent this,
        // here checks the previous input data with the current one.
        if (this.username === this.previousInput) {
          this.entranceTransaction();
        }
      },

      entranceTransaction: function() {
        var username = this.username;

        var error = function(msg) {
          if (msg === null) {
            this.error = false;
            this.message = "";
          } else {
            this.error = true;
            this.message = msg;
          }
        };

        var checkDuplication = function(_next) {
          return api.isNameDuplicated(username).then(function(res) {
            if (res.data && res.data.status) {
              return _next();
            } else {
              return _next(new Error("ユーザー名が使われています"));
            }
          }).catch(function(res) {
            return _next(new Error("システムエラー"));
          });
        };

        var setUserFace = function(_next) {
          this.faces = _.sample(shared.FACE_ASSETS, 3);
          this.currentView = 2;
          return _next();
        };

        Bucks.onError(function(e, bucks) {
          this.resWaiting = false;
          if (e.message) {
            error(e.message);
          } else {
            shared.jumpers.error();
          }
        });

        error(null);
        this.resWaiting = true;

        var _this = this;

        (new Bucks()).then(function(res, next) {
          _this.message = "ユーザ名が使えるかチェックしています...";
          checkDuplication(next);
        }).then(function(res, next) {
          setUserFace(next);
          _this.resWaiting = false;
        }).end();
      }
    }
  };

  module.exports = entranceComponent;
})();
