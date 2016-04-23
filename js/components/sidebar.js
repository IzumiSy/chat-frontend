(function() {
  'use strict';

  var controllers = require("./controller.js");

  var sidebarComponent = {
    template: require("./components/_sidebar.html"),

    data: function() {
      return {
        rooms: [],
        users: [],
        currentUser:   null,
        currentRoomId: null,
        currentFace:   null,
        networkError:  false
      };
    },

    created: controllers.partials.sidebar.created,

    ready: controllers.partials.sidebar.ready,

    beforeDestroy: controllers.partials.sidebar.beforeDestroy,

    methods: {
      onRoomClicked: controllers.partials.sidebar.onRoomClicked,
      onUserClicked: controllers.partials.sidebar.onUserClicked
    }
  };

  module.export = sidebarComponent;
})()
