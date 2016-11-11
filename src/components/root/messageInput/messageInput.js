(function() {
  'use strict';

  var api = require("../../../api.js");
  var shared = require("../../../shared.js");

  var messageInputComponent = {
    template: require("./_message_input.jade")(),

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

    created: function() {
      var _this = this;

      this.$on("app:msgInput:setFocus", function() {
        this.setInputFocus();
      });

      this.$on("app:msgInput:networkError", function() {
        _this.networkError = true;
      });
      this.$on("app:msgInput:networkConnected", function() {
        _this.networkError = false;
      });

      console.info("[APP] Message input ready");
    },

    ready: function() {
      this.setInputFocus();
    },

    methods: {
      setInputFocus: function() {
        $(this.$el).find("input.message").focus();
      },

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

        this.resWaiting = true;
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
      }
    }
  };

  module.exports = messageInputComponent;
})();
