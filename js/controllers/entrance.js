(function() {
  'use strict';

  var _ = require("underscore");
  var api = require("../api.js");
  var shared = require("../shared.js");
  var storage = require("../storage.js");

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
    var storeLobbyId = function(rooms) {
      shared.data.lobbyId = _.find(rooms, function(r) {
        return r.name == "Lobby";
      })._id.$oid;
    };

    var exec = {
      userCreate: function(_next) {
        return api.createNewUser(username).then(function(res) {
          storage.set("token", res.data.token);
          shared.data.user = res.data;
          return _next();
        }).catch(function(res) {
          if (res.data && res.data === "Duplicated user name") {
            return _next(new Error("ユーザー名が使われています"));
          } else {
            return _next(new Error("入室に失敗しました"));
          }
        });
      },

      getRooms: function(_next) {
        return api.getAllRooms().then(function(res) {
          if (!res.data || !res.data.length) {
            throw _next(new Error("ロビールームがありません。"));
          }
          storeLobbyId(res.data);
          shared.data.rooms = res.data;
          return _next();
        }).catch(function(res) {
          return _next(new Error(null));
        });
      },

      setUserFace: function(_next) {
        _this.faces = _.sample(shared.FACE_ASSETS, 3);
        _this.currentView = 2;
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

    _this.resWaiting = true;
    (new Bucks()).then(function(res, next) {
      error(null);
      _this.message = "ユーザ作成中...";
      exec.userCreate(next);
    }).then(function(res, next) {
      _this.message = "ルーム一覧を取得しています...";
      exec.getRooms(next);
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
      entranceTransaction(this);
    },

    selectFace: function(face) {
      var payload = { face: face };
      var userId = shared.data.user._id.$oid;

      this.currentView = 3;
      api.patchUser(userId, payload).then(function(res) {
        if (res.data) {
          shared.data.user = res.data;
        }
        shared.jumpers.root();
      }, function() {
        shared.jumpers.error();
      });
    },

    created: function() {
      api.pingRequest().then(function(res) {
        // noop
      }, function() {
        shared.jumpers.error();
      });
    },

    ready: function() {
      $(this.$el).find("input.login-field").focus();
    }
  };

  module.exports = entranceController;
})();
