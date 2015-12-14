var api = require("./api.js");
var shared = require("./shared.js");
var storage = require("./storage.js");
var utils = require("./utils.js");
var shared = require("./shared.js");

var controllers = {
  root: {
    created: function() {
      if (!utils.checkLogin()) {
        shared.jumpers.entrance();
      }
    }
  },

  error: {
    reload: function() {
      shared.jumpers.root();
    }
  },

  entrance: {
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
  },

  partials: {
    messageInput: {
      sendMessage: function() {
        // send message
      }
    }
  }
};

module.exports = controllers;
