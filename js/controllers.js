var api = require("./api.js");
var shared = require("./shared.js");
var storage = require("./storage.js");
var router = require("./routes.js");

var controllers = {
  root: {
    created: function() {
       // Do something
    }
  },

  entrance: {
    enterRobby:  function(rootObject) {
      if (!rootObject.username) {
        // Shows an error message
        return;
      }

      api.createNewUser(rootObject.username, function(data, isSucceed) {
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
  }
};

module.exports = controllers;
