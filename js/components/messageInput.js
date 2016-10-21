(function() {
  'use strict';

  var controller = require("./controllers/messageInput.js");

  var messageInputComponent = {
    template: require("./_message_input.jade"),

    data: function() {
      return {
        message:       null,
        resWaiting:    false,
        networkError:  false,
        previousInput: null,
      };
    },

    watch: {
      "message": function() {
        this.previousInput = this.message;
      }
    },

    computed: {
      placeholdingText: function() {
        return (
          this.networkError ?
          "ネットワークエラーがおきています..." :
          "メッセージを入力..."
        );
      }
    },

    created: controller.created,
    ready: controller.ready,

    methods: {
      sendMessage: controller.sendMessage
    }
  };

  module.exports = messageInputComponent;
})();
