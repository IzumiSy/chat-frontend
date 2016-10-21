(function() {
  'use strict';

  var controller = require("./controllers/messageView.js");

  var messageViewComponent = {
    template: require("./_message_view.jade")(),

    data: function() {
      return {
        messages: []
      };
    },

    ready: controller.ready,

    methods: {
      isPrevUserSame: controller.isPrevUserSame
    }
  };

  module.exports = messageViewComponent;
})();
