var api = require("../api.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var leaveTransaction = function() {
  var currentRoomId = storage.get("currentRoomId");

  // TODO Need any error handling here?
  api.userRoomLeave(currentRoomId, function() {});

  storage.remove("token");
  storage.remove("currentRoomId");
  shared.jumpers.entrance();
};

var headerController = {
  created: function() {
    this.$on("logout", function(data) {
      leaveTransaction();
    });
  },

  logout: function() {
    leaveTransaction();
  }
};

module.exports = headerController;
