var _ = require("underscore");
var storage = require("../storage.js");

var sidebarController = {
  created: function() {
    this.$on("app:sidebar:updateRooms", function(data) {
      this.$set("rooms", data);
    });
    this.$on("app:sidebar:usersCountUpdate", function(data) {
      rooms = this.$get("rooms");
      index = _.findIndex(rooms, function(r) { return r.id === data.room_id; });
      rooms[index].users_count = data.users_count;
      this.$set("rooms", rooms);
    });
  },

  onRoomClicked: function(room) {
    // TODO change room to the clicked one
  },

  isCurrentRoom: function(room) {
    roomId = room.id
    currentRoomId = storage.get("currentRoomId");
    return roomId == currentRoomId;
  }
};

module.exports = sidebarController;
