(function() {
  'use strict';

  var api = require("../api.js");
  var shared = require("../shared.js");

  var messageInputController = {
    sendMessage: function() {
      var message = this.message;
      var currentRoomId = shared.data.currentRoomId;
      var _this = this;

      if (!currentRoomId) {
        console.warn("Error: currentRoomId is undefined or invalid.");
        return;
      }

      api.sendMessage(currentRoomId, message, function(data, isSuccess) {
        if (!isSuccess) {
          console.warn("Error at api.sendMessage(...)");
          return;
        }
        _this.$set("message", null);
      });
    }
  };

  module.exports = messageInputController;
})();
