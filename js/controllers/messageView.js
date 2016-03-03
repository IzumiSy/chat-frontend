(function() {
  'use strict';

  var shared = require("../shared.js");
  var _ = require("underscore");

  // If 'messages' parameter is given, this method substitutes that messages
  // to shared data as current room messages. If not, this just loads messages
  // of current room and return them.
  var populateRoomMessages = function(messages) {
    var currentRoomId = shared.data.currentRoomId;
    var currentRoomMessages = [];

    if (currentRoomId) {
      if (messages !== undefined && $.isArray(messages)) {
        shared.data.channel_messages[currentRoomId] = messages;
        return messages;
      }

      currentRoomMessages = shared.data.channel_messages[currentRoomId];
      if (!currentRoomMessages) {
         shared.data.channel_messages[currentRoomId] = [];
         currentRoomMessages = [];
      }
    }

    return currentRoomMessages;
  };

  var roomChange = function(_this) {
    _this.$set("messages", populateRoomMessages());
  };

  var scrollToBottom = function() {
    // TODO Handle scroll
  };

  var addMessage = function(_this, data) {
    var messages = _this.$get("messages");
    messages.push(data);
    _this.$set("messages", populateRoomMessages(messages));
    Vue.nextTick(scrollToBottom());
  };

  var listenersSetup = function(_this) {
    _this.$on("app:msgView:roomChange", function() {
      roomChange(_this);
    });
    _this.$on("app:msgView:addMessage", function(data) {
      addMessage(_this, data);
    });
    _this.$on("app:msgView:scrollBottom", function() {
      // TODO Scroll bottom
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
