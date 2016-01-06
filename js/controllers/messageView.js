var messageViewController = {
  created: function() {
    this.$once("app:msgView:setMessage", function(messages) {
      // TODO set old messages
    });

    this.$on("app:msgView:addMessage", function(message) {
      // TODO append a new messages to the messages on main-view
    });
  }
};

module.exports = messageViewController;
