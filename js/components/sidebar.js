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
        networkError:  false
      };
    },

    created: controller.created,

    ready: controller.ready,

    beforeDestroy: controller.beforeDestroy,

    methods: {
      onRoomClicked: controller.onRoomClicked,
      onUserClicked: controller.onUserClicked,

      // Here returns v-bind:class contents for its own,
      // because Jade cannot use new linings in double-quoted attributes.

      roomItemClasses: function(room) {
        return {
          'current': (this.currentRoomId == room._id.$oid),
          'error': this.networkError
        };
      },

      userItemClasses: function() {
        return {
          'error': this.networkError
        };
      }
    }
  };

  module.exports = sidebarComponent;
})();
