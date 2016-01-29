(function() {
  'use strict';

  var shared = require("../shared.js");

  var listenersSetup = function(_this) {
    _this.$on("app:msgView:roomChange", function() {
      var currentRoomId = shared.data.currentRoomId;
      var currentRoomMessages = null;

      if (currentRoomId) {
        currentRoomMessages = shared.data.channel_messages[currentRoomId];
        if (!currentRoomMessages) {
           shared.data.channel_messages[currentRoomId] = [];
           currentRoomMessages = [];
        }
      }
      _this.$set("messages", currentRoomMessages);
    });

    _this.$on("app:msgView:scrollBottom", function() {
      // TODO Scroll bottom
    });

    _this.$on("app:msgView:addMessage", function(data) {
      var messages = _this.$get("messages");
      var currentRoomId = shared.data.currentRoomId;
      var currentRoomMessages = null;

      messages.push(data);
      _this.$set("messages", messages);

      if (currentRoomId) {
        currentRoomMessages = shared.data.channel_messages[currentRoomId];
        if (currentRoomMessages) {
          shared.data.channel_messages[currentRoomId] = messages;
        } else {
          shared.data.channel_messages[currentRoomId] = [];
        }
      }
    });
  };

  var messageViewController = {
    ready: function() {
      listenersSetup(this);
    },

    isPrevUserSame: function(index) {
      var messages = this.$get("messages");
      var isSame = false;

      if (index > 0) {
        isSame = (messages[index - 1].user_id.$oid == messages[index].user_id.$oid);
      }

      return isSame;
    }
  };

  module.exports = messageViewController;
})();
