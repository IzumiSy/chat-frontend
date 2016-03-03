(function() {
  'use strict';

  var storage = require("./storage.js");

  var functions = {
    checkLogin: function() {
      var token = storage.get("token");
      if (token) {
        return true;
      } else {
        return false;
      }
    },

    attrFaceAsset: function(face) {
      return ("assets/face-" + face + ".png");
    },

    formatCreatedAtTime: function(messageData) {
      var date = new Date(messageData.created_at);
      messageData.formatted_created_at_time =
        (date.getHours() + ":" + date.getMinutes());
      return messageData;
    }
  };

  module.exports = functions;
})();
