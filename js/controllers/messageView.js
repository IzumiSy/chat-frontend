(function() {
  'use strict';

  var listenersSetup = function(_this) {
    _this.$on("app:msgView:setMessages", function(messages) {
      _this.$set("messages", messages);
    });
    _this.$on("app:msgView:addMessage", function(data) {
      var messages = _this.$get("messages");
      messages.push(data);
      _this.$set("messages", messages);
    });
    _this.$on("app:msgView:scrollBottom", function() {
      // TODO Scroll bottom
    });
  };

  var messageViewController = {
    ready: function() {
      listenersSetup(this);
    },

    isPrevUserSame: function(index) {
      var messages = this.$get("messages");
      var isSame = false;

      if (index > 0) {
        isSame = (messages[index - 1].user_id.$oid == messages[index].user_id.$oid);
      }

      return isSame;
    }
  };

  module.exports = messageViewController;
})();
