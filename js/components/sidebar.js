(function() {
  'use strict';

  var controller = require("./controllers/sidebar.js");

  var sidebarComponent = {
    template: require("../_sidebar.html"),

    data: function() {
      return {
        rooms: [],
        users: [],
        currentUser:   null,
        currentRoomId: null,
        currentFace:   null,
        networkError:  false,

        bindingClasses: {
          'current': (currentRoomId == room._id.$oid),
          'error': networkError
        }
      };
    },

    created: controller.created,

    ready: controller.ready,

    beforeDestroy: controller.beforeDestroy,

    methods: {
      onRoomClicked: controller.onRoomClicked,
      onUserClicked: controller.onUserClicked
    }
  };

  module.exports = sidebarComponent;
})();
