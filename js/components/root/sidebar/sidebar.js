(function() {
  'use strict';

  var controller = require("./sidebarController.js");

  var sidebarComponent = {
    template: require("./_sidebar.jade")(),

    data: function() {
      return {
        rooms: [],
        users: [],

        currentUser:   null,
        currentRoomId: null,
        currentFace:   null,
        networkError:  false,

        // Here will be updated right after curretnRoomId is set
        // from message dispatching of root controller.
        nowLoading: true
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
          'disabled': this.networkError || this.nowLoading
        };
      },

      userItemClasses: function() {
        return {
          'disabled': this.networkError || this.nowLoading
        };
      }
    }
  };

  module.exports = sidebarComponent;
})();
