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
    var storeLobbyId = function(rooms) {
      shared.data.lobbyId = _.find(rooms, function(r) {
        return r.name == "Lobby";
      })._id.$oid;
    };

    var exec = {
      checkDuplication: function(_next) {
        return api.isNameDuplicated(username).then(function(res) {
          if (res.data && res.data.status) {
            _next()
          } else {
            return _next(new Error("ユーザー名が使われています"));
          }
        }).catch(function(res) {
          return _next(new Error("システムエラー"));
        });
      },

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

    error(null);
    _this.resWaiting = true;

    (new Bucks()).then(function(res, next) {
      _this.message = "ユーザ名が使えるかチェックしています...";
      exec.checkDuplication(next);
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

      // Vue.js catches enter with IME on, so to prevent this,
      // here checks the previous input data with the current one.
      if (this.username === this.previousInput) {
        entranceTransaction(this);
      }
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
