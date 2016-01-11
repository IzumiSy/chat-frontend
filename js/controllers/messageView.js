(function() {
  'use strict';

  var messageViewController = {
    created: function() {
      this.$on("app:msgView:setMessages", function(messages) {
        this.$set("messages", messages);
      });

      this.$on("app:msgView:addMessage", function(data) {
        var messages = this.$get("messages");
        messages.push(data);
        this.$set("messages", messages);
      });
    },

    ready: function() {
      this.$on("app:msgView:scrollBottom", function() {
        // TODO Scroll bottom
      });
    }
  };

  module.exports = messageViewController;
})();
