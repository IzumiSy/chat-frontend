var _ = require("underscore");

var sidebarController = {
  created: function() {
    this.$on("app:sidebar:updateRooms", function(data) {
      this.$set("rooms", data);
    });
    this.$on("app:sidebar:usersUpdate", function(data) {
      rooms = this.$get("rooms");
      index = _.findIndex(rooms, function(r) { return r.id === data.room_id; });
      rooms[index].users_count = data.users_count;
      this.$set("rooms", rooms);
    });
  },

  onRoomClicked: function(room) {
    // TODO change room to the clicked one
  }
};

module.exports = sidebarController;
