var _ = require("underscore");
var storage = require("../storage.js");
var api = require("../api.js");

var sidebarController = {
  created: function() {
    this.$on("app:sidebar:updateRooms", function(data) {
      this.$set("rooms", data);
    });
    this.$once("app:sidebar:setCurrentRoom", function(roomId) {
      this.$set("currentRoomId", roomId);
    });
  },

  onRoomClicked: function(room) {
    var currentRoomId = storage.get("currentRoomId");
    var nextRoomId = room.id;
    var _this = this;

    storage.set("currentRoomId", nextRoomId);
    _this.currentRoomId = nextRoomId;

    // userRoomLeave doesnt have to be called here.
    // because userRoomEnter updates current room data to the new one.
    api.userRoomEnter(nextRoomId, function(data, isSuccess) {
      if (!isSuccess) {
        console.warn("Error at api.userRoomEnter: Id(" + lobbyId + ")");
      }
    });
  }
};

module.exports = sidebarController;
