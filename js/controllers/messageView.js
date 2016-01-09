var messageViewController = {
  created: function() {
    this.$once("app:msgView:setMessage", function(messages) {
      this.$set("messages", messages);
    });

    this.$on("app:msgView:addMessage", function(data) {
      // TODO append a new messages to the messages on main-view
    });
  }
};

module.exports = messageViewController;
