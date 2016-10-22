(function() {
  'use strict';

  var _ = require("underscore");
  var api = require("../../api.js");
  var shared = require("../../shared.js");
  var storage = require("../../storage.js");

  var entranceTransaction = function(_this) {
    var username = _this.username;

    var error = function(msg) {
      if (msg === null) {
        _this.error = false;
        _this.message = "";
      } else {
        _this.error = true;
        _this.message = msg;
      }
    };

    var exec = {
      checkDuplication: function(_next) {
        return api.isNameDuplicated(username).then(function(res) {
          if (res.data && res.data.status) {
            return _next();
          } else {
            return _next(new Error("ユーザー名が使われています"));
          }
        }).catch(function(res) {
          return _next(new Error("システムエラー"));
        });
      },

      setUserFace: function(_next) {
        _this.faces = _.sample(shared.FACE_ASSETS, 3);
        _this.currentView = 2;
        return _next();
      },
    };

    Bucks.onError(function(e, bucks) {
      _this.resWaiting = false;
      if (e.message) {
        error(e.message);
      } else {
        shared.jumpers.error();
      }
    });

    error(null);
    _this.resWaiting = true;

    (new Bucks()).then(function(res, next) {
      _this.message = "ユーザ名が使えるかチェックしています...";
      exec.checkDuplication(next);
    }).then(function(res, next) {
      exec.setUserFace(next);
      _this.resWaiting = false;
    }).end();
  };

  var entranceController = {
    enterRobby: function() {
      if (!this.username) {
        error("ログインネームを入力してください");
        return;
      }

      // Vue.js catches enter with IME on, so to prevent this,
      // here checks the previous input data with the current one.
      if (this.username === this.previousInput) {
        entranceTransaction(this);
      }
    },

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
    }
  };

  module.exports = entranceController;
})();
