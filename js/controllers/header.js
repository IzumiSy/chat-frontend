var api = require("../api.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var headerController = {
  logout: function() {
    var currentRoomId = storage.get("currentRoomId");

    storage.remove("token");
    storage.remove("currentRoomId");
    shared.jumpers.entrance();

    // TODO Need any error handling here?
    api.userRoomLeave(currentRoomId, function() {});
  }
};

module.exports = headerController;
