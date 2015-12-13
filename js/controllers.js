var api = require("./api.js");
var shared = require("./shared.js");
var storage = require("./storage.js");
var utils = require("./utils.js");

var controllers = {
  root: {
    created: function() {
      if (!utils.checkLogin()) {
        // Jump to the entrance view
      }
    }
  },

  error: {
    reload: function() {
      // Jump to the root view
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
          // Jump to the root page
        } else {
          // Shows an error message
        }
      });
    },

    created: function() {
      var token = storage.get("token");
      if (token) {
        // Jump to the root page
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
