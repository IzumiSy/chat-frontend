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
    if (!this.username) {
      // Shows an error message
      return;
    }

    api.createNewUser(this.username, function(data, isSucceed) {
      if (isSucceed) {
        storage.set("token", data.token);
        shared.jumpers.root();
      } else {
        shared.jumpers.error();
      }
    });
  },

  created: function() {
    var token = storage.get("token");
    if (token) {
      shared.jumpers.root();
    }
  }
};

var controllers = {
  root: rootControllers,
  error: errorControllers,
  entrance: entranceControllers,

  partials: {
    messageInput: {
      sendMessage: function() {
        // send message
      }
    }
  }
};

module.exports = controllers;
