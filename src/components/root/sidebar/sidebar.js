(function() {
  'use strict';

  require('./sidebar.scss');

  var _ = require("underscore");
  var shared = require("../../../shared.js");
  var api = require("../../../api.js");
  var utils = require("../../../utils.js");

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

    created: function() {
      this.listenersSetup();
      this.$set("currentUser", shared.data.user);
    },

    ready: function() {
      if (shared.data.user && shared.data.user.face) {
        this.currentFace = utils.attrFaceAsset(shared.data.user.face);
      }
      console.info("[APP] Sidebar ready.");
    },

    // RocketIO subscribers for user leave/enter are always called on
    // even when the current user leaves from the chat.
    // so sidebar event listeners have to be "off"ed before elements destroy.
    beforeDestroy: function() {
      this.$off();
    },

    methods: {
      listenersSetup: function() {
        var _this = this;

        this.$once("app:sidebar:setCurrentRoom", function(roomId) {
          _this.$set("currentRoomId", roomId);
          _this.nowLoading = false;
        });

        this.$on("app:sidebar:updateRooms", function(data) {
          _this.$set("rooms", data);
        });
        this.$on("app:sidebar:updateUsers", function(data) {
          _this.$set("users", data);
        });

        this.$on("app:sidebar:networkError", function() {
          _this.networkError = true;
        });
        this.$on("app:sidebar:networkConnected", function() {
          _this.networkError = false;
        });
      },

      onRoomClicked: function(room) {
        if (this.networkError || this.nowLoading) {
          return;
        }

        var currentRoomId = shared.data.currentRoomId;
        var nextRoomId = room._id.$oid;

        if (nextRoomId === currentRoomId) {
          return;
        }

        shared.data.currentRoomId = nextRoomId;
        this.$set("currentRoomId", nextRoomId);
        this.$set("users", []);
        this.nowLoading = true;

        this.$dispatch("app:root:roomChange");

        // userRoomLeave doesnt have to be called here.
        // because userRoomEnter updates current room data to the new one.

        // This dispater cannot be asynchronizing, because
        // app:root:fetchRoomData needs waiting for update of user list in backend.
        var _this = this;
        api.userRoomEnter(nextRoomId).then(function(res) {
          _this.$dispatch("app:root:fetchRoomData", nextRoomId);
          _this.nowLoading = false;
        }, function() {
          console.warn("Error at api.userRoomEnter: Id(" + nextRoomId + ")");
        });
      },

      onUserClicked: function(user) {
        if (this.networkError || this.nowLoading) {
          return;
        }
      },

      // roomItemClasses returns v-bind:class contents for its own,
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
