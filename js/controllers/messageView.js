(function() {
  'use strict';

  var messageViewController = {
    created: function() {
      this.$on("app:msgView:setMessages", function(messages) {
        this.$set("messages", messages);
      });

      this.$on("app:msgView:addMessage", function(data) {
        // TODO append a new messages to the messages on main-view
      });
    }
  };

  module.exports = messageViewController;
})();
