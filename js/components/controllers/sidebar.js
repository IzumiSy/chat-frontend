(function() {
  'use strict';

  var _ = require("underscore");
  var shared = require("../../shared.js");
  var api = require("../../api.js");
  var utils = require("../../utils.js");

  var listenersSetup = function(_this) {
    _this.$once("app:sidebar:setCurrentRoom", function(roomId) {
      _this.$set("currentRoomId", roomId);
      _this.nowLoading = false;
    });

    _this.$on("app:sidebar:updateRooms", function(data) {
      _this.$set("rooms", data);
    });
    _this.$on("app:sidebar:updateUsers", function(data) {
      _this.$set("users", data);
    });

    _this.$on("app:sidebar:networkError", function() {
      _this.networkError = true;
    });
    _this.$on("app:sidebar:networkConnected", function() {
      _this.networkError = false;
    });
  };

  var sidebarController = {
    created: function() {
      listenersSetup(this);
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

    onRoomClicked: function(room) {
      if (this.networkError || this.nowLoading) {
        return;
      }

      var currentRoomId = shared.data.currentRoomId;
      var nextRoomId = room._id.$oid;
      var _this = this;

      if (nextRoomId === currentRoomId) {
        return;
      }

      shared.data.currentRoomId = nextRoomId;
      _this.$set("currentRoomId", nextRoomId);
      _this.$set("users", []);
      _this.nowLoading = true;

      _this.$dispatch("app:root:roomChange");

      // userRoomLeave doesnt have to be called here.
      // because userRoomEnter updates current room data to the new one.

      // This dispater cannot be asynchronizing, because
      // app:root:fetchRoomData needs waiting for update of user list in backend.
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
    }
  };

  module.exports = sidebarController;
})();
