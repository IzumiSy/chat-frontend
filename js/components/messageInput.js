(function() {
  'use strict';

  var controllers = require("./controllers.js");

  var messsageInputComponent = {
    template: require("./components/_message_input.html"),

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
          "送信するテキストを入力..."
        );
      }
    },

    created: controllers.partials.messageInput.created,
    ready: controllers.partials.messageInput.ready

    methods: {
      sendMessage: controllers.partials.messageInput.sendMessage
    }
  }

  module.export = messageInputComponent;
})()
