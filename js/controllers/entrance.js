var api = require("../api.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var entranceController = {
  enterRobby: function() {
    var username = this.username;
    var isAvailable = false;
    var _this = this;

    var error = function(msg) {
      if (msg === null) {
        _this.error = false;
        _this.message = "";
      } else {
        _this.error = true;
        _this.message = msg;
      }
    };

    if (!username) {
      error("ログインネームを入力してください");
      return;
    }

    (new Bucks()).then(function(res, next) {
      error(null);
      _this.message = "ログインネームが使えるか調べています...";
      api.checkNameAvailability(username, function(data, isSuccess) {
        if (isSuccess && data && data.status === true) {
          isAvailable = true;
          _this.message = "入室処理中...";
          return next(null, true);
        } else {
          error("ログインネームがすでに使われていました");
          return next(null, false);
        }
      });
    }).then(function(res, next) {
      if (!res) return next(null, false);
      api.createNewUser(username, function(data, isSucceed) {
        if (isSucceed) {
          storage.set("token", data.token);
          shared.data.user = data;
          shared.jumpers.root();
          return next(null, true);
        } else {
          error("入室に失敗しました");
          return next(null, false);
        }
      });
    }).end();
  },

  created: function() {
    var token = storage.get("token");
    if (token) {
      shared.jumpers.root();
      return;
    }
  }
};

module.exports = entranceController;
