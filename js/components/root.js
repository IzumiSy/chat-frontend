(function() {
  'use strict';

  var controller = require("./controllers/root.js");

  var components = {
    header:       require("./header.js"),
    sidebar:      require("./sidebar.js"),
    messageView:  require("./messageView.js"),
    messageInput: require("./messageInput")
  };

  var rootComponent = {
    template: require("../main.html"),

    components: {
      "va-header":        components.header,
      "va-sidebar":       components.sidebar,
      "va-message-view":  components.messageView,
      "va-message-input": components.messageInput
    },

    data: function() {
      return {
        rooms: [],
        msgListener: null
      };
    },

    created: controller.created,

    ready: controller.ready
  };

  module.exports = rootComponent;
})();
