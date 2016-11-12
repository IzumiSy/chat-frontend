(function() {
  'use strict';

  var shared = require("../../../shared.js");
  var _ = require("underscore");

  var messageViewComponent = {
    template: require("./_message_view.jade")(),

    data: function() {
      return {
        messages: []
      };
    },

    ready: function() {
      this.listenersSetup();
      console.info("[APP] Message view ready.");
    },

    methods: {
      // If 'messages' parameter is given, this method substitutes that messages
      // to shared data as current room messages. If not, this just loads messages
      // of current room and return them.
      populateRoomMessages: function(messages) {
        var currentRoomId = shared.data.currentRoomId;
        var currentRoomMessages = [];

        if (currentRoomId) {
          if (messages !== undefined && $.isArray(messages)) {
            shared.data.channelMessages[currentRoomId] = messages;
            return messages;
          }

          currentRoomMessages = shared.data.channelMessages[currentRoomId];
          if (!currentRoomMessages) {
             shared.data.channelMessages[currentRoomId] = [];
             currentRoomMessages = [];
          }
        }

        return currentRoomMessages;
      },

      roomChange: function() {
        this.$set("messages", this.populateRoomMessages());
      },

      addMessage: function(data) {
        var messages = this.$get("messages");
        messages.push(data);
        this.$set("messages", this.populateRoomMessages(messages));
        Vue.nextTick(this.scrollToBottom);
      },

      scrollToBottom: function() {
        // TODO Handle scroll
      },

      listenersSetup: function() {
        var _this = this;

        this.$on("app:msgView:roomChange", function() {
          _this.roomChange();
        });
        this.$on("app:msgView:addMessage", function(data) {
          _this.addMessage(data);
        });
        this.$on("app:msgView:scrollBottom", function() {
          _this.scrollToBottom()
        });
      },

      isPrevUserSame: function(index) {
        var messages = this.$get("messages");
        var isSame = false;

        if (index > 0) {
          isSame = (messages[index - 1].user_id.$oid == messages[index].user_id.$oid);
        }

        return isSame;
      }
    }
  };

  module.exports = messageViewComponent;
})();
