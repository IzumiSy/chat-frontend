var api = require("./api.js");
var shared = require("./shared.js");
var router = require("./routes.js");
var storage = require("./storage.js");

var controllers = {
  entrance: {
    enterRobby:  function(rootObject) {
      if (!rootObject.username) {
        // Shows an error message
        return;
      }

      api.createNewUser(rootObject.username, function(data, isSucceed) {
        if (isSucceed) {
          storage.set("token", data.token);
          router.go({ path: "/" });
        } else {
          // Shows an error message
        }
      });
    },

    created: function() {
      token = storage.get("token");
      if (token) {
        router.go({ path: "/" });
      }
    }
  }
};

module.exports = controllers;
