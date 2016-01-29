(function() {
  'use strict';

  var api = require("../api.js");
  var shared = require("../shared.js");

  var setInputFocus = function(_this) {
    $(_this.$el).find("input.message").focus();
  };

  var messageInputController = {
    sendMessage: function() {
      var message = this.message;
      var currentRoomId = shared.data.currentRoomId;
      var _this = this;

      if (!currentRoomId) {
        console.warn("Error: currentRoomId is undefined or invalid.");
        return;
      }

      api.sendMessage(currentRoomId, message).then(function(res) {
        _this.$set("message", null);
        _this.$dispatch("app:root:newMessage");
      }, function() {
        console.warn("Error at api.sendMessage(...)");
      });
    },

    created: function() {
      this.$on("app:msgInput:setFocus", function() {
        setInputFocus(this);
      });
    },

    ready: function() {
      setInputFocus(this);
    }
  };

  module.exports = messageInputController;
})();
