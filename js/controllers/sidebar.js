var sidebarController = {
  created: function() {
    this.$on("app:sidebar:updateRooms", function(data) {
      this.$set("rooms", data);
    });
  },

  onRoomClicked: function(room) {
    // TODO change room to the clicked one
  }
};

module.exports = sidebarController;
