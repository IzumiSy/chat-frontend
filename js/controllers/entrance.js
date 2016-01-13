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
    var storeLobbyId = function(rooms, _next) {
      shared.data.lobbyId = _.find(rooms, function(r) {
        return r.name == "Lobby";
      })._id.$oid;
      if (!shared.data.lobbyId) {
        error("ロビールームがありません。")
        return _next(null, false);
      }
    };

    var exec = {
      nameCheck: function(_next) {
        api.checkNameAvailability(username, function(data, isSuccess) {
          if (isSuccess && data && data.status === true) {
            _this.message = "入室処理中...";
            return _next(null, true);
          } else {
            error("ログインネームがすでに使われていました");
            return _next(null, false);
          }
        });
      },

      userCreate: function(_next) {
        api.createNewUser(username, function(data, isSucceed) {
          if (!isSucceed || !data) {
            error("入室に失敗しました");
            return _next(null, false);
          }
          storage.set("token", data.token);
          shared.data.user = data;
          return _next(null, true);
        });
      },

      getRooms: function(_next) {
        api.getAllRooms(function(data, isSuccess) {
          if (!isSuccess || !data) {
            console.warn("Error at api.getAllRooms");
            return _next(null, false);
          } else if (!data.length) {
            console.warn("Rooms not found");
            shared.jumpers.error();
            return _next(null, false);
          }
          shared.data.rooms = data;
          storeLobbyId(data);
          shared.jumpers.root();
          return _next();
        });
      }
    };

    (new Bucks()).then(function(res, next) {
      error(null);
      _this.message = "ログインネームが使えるか調べています...";
      exec.nameCheck(next);
    }).then(function(res, next) {
      if (!res) return next(null, false);
      _this.message = "ユーザ作成中...";
      exec.userCreate(next);
    }).then(function(res, next) {
      if (!res) return next();
      _this.message = "ルーム一覧を取得しています...";
      exec.getRooms(next);
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

    created: function() {
      (new Bucks()).then(function(res, next) {
        api.pingRequest(function(data, isSucceed) {
          if (isSucceed) return next();
          shared.jumpers.error();
          return;
        });
      }).then(function(res, next) {
        if (storage.get("token")) {
          shared.jumpers.root();
          return next();
        }
      }).end();
    },

    ready: function() {
      $(this.$el).find("input.login-field").focus();
    }
  };

  module.exports = entranceController;
})();
