(function() {
  'use strict';

  var api = require("../api.js");
  var shared = require("../shared.js");

  var setInputFocus = function(_this) {
    $(_this.$el).find("input.message").focus();
  };

  var messageInputController = {
    sendMessage: function() {
      // Prevention for mis-enter with IME on
      if (this.message !== this.previousInput) {
        return;
      }

      var message = this.message;
      var currentRoomId = shared.data.currentRoomId;
      var _this = this;

      if (!currentRoomId) {
        console.warn("Error: currentRoomId is undefined or invalid.");
        return;
      }

      _this.resWaiting = true;
      api.sendMessage(currentRoomId, message).then(function(res) {
        _this.$set("message", null);
        _this.$dispatch("app:root:newMessage");
        _this.resWaiting = false;

        Vue.nextTick(function() {
          $(_this.$el).find("input.message").focus();
        });
      }, function() {
        console.warn("Error at api.sendMessage(...)");
      });
    },

    created: function() {
      var _this = this;

      this.$on("app:msgInput:setFocus", function() {
        setInputFocus(this);
      });

      this.$on("app:msgInput:networkError", function() {
        _this.networkError = true;
      });
      this.$on("app:msgInput:networkConnected", function() {
        _this.networkError = false;
      });
    },

    ready: function() {
      setInputFocus(this);
    }
  };

  module.exports = messageInputController;
})();
