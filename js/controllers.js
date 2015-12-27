var _ = require("underscore");

var api = require("./api.js");
var shared = require("./shared.js");
var storage = require("./storage.js");
var utils = require("./utils.js");
var shared = require("./shared.js");

var errorControllers = {
  reload: function() {
    shared.jumpers.root();
  }
};

var rootControllers = {
  created: function() {
    var _this = this;
    var lobbyId = null;

    if (!utils.checkLogin()) {
      shared.jumpers.entrance();
    }

    // Always an user enters Lobby at the first time when logging in.
    (new Bucks()).then(function(res, next) {
      api.getAllRooms(function(data, isSuccess) {
        if (!isSuccess || !data) {
          console.warn("Error at api.getAllRooms");
          return next(null, false);
        }
        _this.rooms = data;
        lobbyId = _.find(_this.rooms, function(r) { return r.name == "Lobby"; }).id;
        return next(null, true);
      });
    }).then(function(res, next) {
      if (!res) return next(null, false);
      api.userRoomEnter(lobbyId, function(data, isSuccess) {
        if (isSuccess) {
          return next(null, true);
        } else {
          console.warn("Error at api.userRoomEnter: Id(" + lobbyId + ")");
          return next(null, false);
        }
      });

    }).end();
  }
};

var entranceControllers = {
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
      _this.message = "名前が使えるか調べています...";
      api.checkNameAvailability(username, function(data, isSuccess) {
        if (data && data.status === true) {
          isAvailable = true;
          _this.message = "ログイン処理中...";
          return next(null, true);
        } else {
          error("ログインネームがすでに使われています");
          return next(null, false);
        }
      });
    }).then(function(res, next) {
      if (!res) return next(null, false);
      api.createNewUser(username, function(data, isSucceed) {
        if (isSucceed) {
          storage.set("token", data.token);
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

var messageInputControllers = {
  sendMessage: function() {
    // TODO send message
  }
};

var headerControllers = {
  logout: function() {
    (new Bucks()).then(function(res, next) {
      // TODO
      // api.userRoomLeave(...)
      // return false when getting error
      return next(null, true);
    }).then(function(res, next) {
      if (!res) return next(null, false);
      storage.remove("token");
      shared.jumpers.entrance();
      return next(null, true);
    }).end();
  }
};

var controllers = {
  root: rootControllers,
  error: errorControllers,
  entrance: entranceControllers,

  partials: {
    messageInput: messageInputControllers,
    header: headerControllers
  }
};

module.exports = controllers;
