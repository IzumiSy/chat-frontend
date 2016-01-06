var api = require("../api.js");
var shared = require("../shared.js");

var messageInputController = {
  sendMessage: function() {
    var message = this.message;
    var currentRoomId = shared.data.currentRoomId;

    if (!currentRoomId) {
      console.warn("Error: currentRoomId is undefined or invalid.");
      return;
    }

    api.sendMessage(currentRoomId, function(data, isSuccess) {
      if (!isSuccess) {
        console.warn("Error at api.sendMessage(...)");
        return;
      }
      this.$set("message", null);
    });
  }
};

module.exports = messageInputController;
