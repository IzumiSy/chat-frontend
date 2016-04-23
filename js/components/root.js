(function() {
  'use strict';

  var controllers = require("./controllers/root.js");

  var rootComponent = {
    template: require("../main.html"),

    components: {
      "va-header": _partials.header,
      "va-sidebar": _partials.sidebar,
      "va-message-view": _partials.message_view,
      "va-message-input": _partials.message_input
    },

    data: function() {
      return {
        rooms: [],
        msgListener: null
      };
    },

    created: controllers.root.created,

    ready: controllers.root.ready
  };

  module.export = rootComponent;
})()
