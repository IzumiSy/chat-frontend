var sidebarController = {
  created: function() {
    this.$on("app:sidebar:updateRooms", function(data) {
      this.$set("rooms", data);
    });
  }
};

module.exports = sidebarController;
