var _ = require("underscore");
var storage = require("../storage.js");
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
  },

  onRoomClicked: function(room) {
    var currentRoomId = storage.get("currentRoomId");
    var nextRoomId = room.id;
    var _this = this;

    storage.set("currentRoomId", nextRoomId);
    _this.currentRoomId = nextRoomId;
    _this.$set("users", []);

    // userRoomLeave doesnt have to be called here.
    // because userRoomEnter updates current room data to the new one.
    api.userRoomEnter(nextRoomId, function(data, isSuccess) {
      if (!isSuccess) {
        console.warn("Error at api.userRoomEnter: Id(" + nextRoomId + ")");
      }
    });

    api.getRoomUsers(nextRoomId, function(data, isSuccess) {
      if (isSuccess) {
        _this.$set("users", data);
      } else {
        console.warn("Error at api.getRoomUsers: Id(" + nextRoomId + ")");
      }
    });
  },

  onUserClicked: function(user) {

  }
};

module.exports = sidebarController;
