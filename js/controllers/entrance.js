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
        api.createNewUser(username).then(function(res) {
          storage.set("token", res.data.token);
          shared.data.user = res.data;
          return _next(null, true);
        }, function(res) {
          if (res.data && res.data == "Duplicated user name") {
            error("ユーザー名が使われています");
          } else {
            error("入室に失敗しました");
          }
          return _next(null, false);
        });
      },

      getRooms: function(_next) {
        api.getAllRooms().then(function(res) {
          if (!res.data) {
            shared.jumpers.error();
            return _next();
          }
          if (!res.data.length) {
            error("ロビールームがありません。");
            return;
          }
          storeLobbyId(res.data);
          shared.data.rooms = res.data;
          shared.jumpers.root();
          return _next();
        }, function() {
          console.warn("Error at api.getAllRooms");
          shared.jumpers.error();
          return _next(null, false);
        });
      }
    };

    (new Bucks()).then(function(res, next) {
      error(null);
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
