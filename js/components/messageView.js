(function() {
  'use strict';

  var controllers = require("./controllers/messageView.js");

  var messageViewComponent = {
    template: require("../_message_view.html"),

    data: function() {
      return {
        messages: []
      };
    },

    ready: controllers.partials.messageView.ready,

    methods: {
      isPrevUserSame: controllers.partials.messageView.isPrevUserSame
    }
  }

  module.export = messageViewComponent;
})()
