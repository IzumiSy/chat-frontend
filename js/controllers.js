var api = require("./api.js");
var shared = require("./shared.js");
var storage = require("./storage.js");
var utils = require("./utils.js");
var shared = require("./shared.js");

var rootControllers = {
  created: function() {
    if (!utils.checkLogin()) {
      shared.jumpers.entrance();
    }
  }
};

var errorControllers = {
  reload: function() {
    shared.jumpers.root();
  }
};

var entranceControllers = {
  enterRobby: function() {
    var username = this.username;

    if (!username) {
      // Shows an error message
      return;
    }

    (new Bucks()).then(function(res, next) {
      api.createNewUser(username, function(data, isSucceed) {
        if (isSucceed) {
          storage.set("token", data.token);
          return next(null, true);
        } else {
          shared.jumpers.error();
          return next(null, false);
        }
      });
    }).then(function(res, next) {
      if (res === true) {
        // TODO
        // api.userRoomEnter(...)
        // return false when getting error or true in success
      }
    }).then(function(res, next) {
      if (res === true) {
        // TODO shared.jumpers.root();
      }
    }).end();
  },

  created: function() {
    var token = storage.get("token");
    if (token) {
      shared.jumpers.root();
      return;
    }

    api.getAllRooms(function(data, isSucceed) {
      // TODO implement store room data
    });
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
      if (res === true) {
        shared.jumpers.entrance();
      }
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
