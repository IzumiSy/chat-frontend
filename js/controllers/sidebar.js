(function() {
  'use strict';

  var _ = require("underscore");
  var shared = require("../shared.js");
  var api = require("../api.js");

  var sidebarController = {
    created: function() {
      this.$once("app:sidebar:setCurrentRoom", function(roomId) {
        this.$set("currentRoomId", roomId);
      });

      this.$on("app:sidebar:updateRooms", function(data) {
        this.$set("rooms", data);
      });
      this.$on("app:sidebar:updateUsers", function(data) {
        this.$set("users", data);
      });

      this.$set("currentUser", shared.data.user);
    },

    ready: function() {
      if (shared.data.user && shared.data.user.face) {
        this.currentFace = ("assets/face-" + shared.data.user.face + ".png");
      }
    },

    onRoomClicked: function(room) {
      var currentRoomId = shared.data.currentRoomId;
      var nextRoomId = room._id.$oid;
      var _this = this;

      shared.data.currentRoomId = nextRoomId;
      _this.$set("currentRoomId", nextRoomId);
      _this.$set("users", []);

      // userRoomLeave doesnt have to be called here.
      // because userRoomEnter updates current room data to the new one.
      api.userRoomEnter(nextRoomId, function(data, isSuccess) {
        if (!isSuccess) {
          console.warn("Error at api.userRoomEnter: Id(" + nextRoomId + ")");
        }
      });

      _this.$dispatch("app:root:fetchRoomData", nextRoomId);
    },

    onUserClicked: function(user) {

    }
  };

  module.exports = sidebarController;
})();
