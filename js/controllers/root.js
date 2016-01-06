var api = require("../api.js");
var utils = require("../utils.js");
var shared = require("../shared.js");

var fetchUsersAndMessages = function(_this, roomId) {
  api.getRoomUsers(roomId, function(data, isSuccess) {
    if (isSuccess && data) {
      _this.$broadcast("app:sidebar:updateUsers", data);
      shared.data.currentRoomUsers = data;
    } else {
      console.warn("Error at api.getRoomUsers");
    }
  });

  api.getRoomMessages(roomId, function(data, isSuccess) {
    if (isSuccess && data) {
      // TODO Display all messages in the center view
    } else {
      console.warn("Error at api.getRoomMessages");
    }
  });
};

var setupNewMessageListener = function(_this, roomId) {
  data.shared.rocketio = api.connectRocketIO();
};

var enterRoom = function(_this, bucksNext, roomId) {
  api.userRoomEnter(roomId, function(data, isSuccess) {
    if (isSuccess) {
      _this.$broadcast("app:sidebar:setCurrentRoom", roomId);
      shared.data.currentRoomId = roomId;
      return bucksNext(null, true);
    } else {
      console.warn("Error at api.userRoomEnter: Id(" + roomId + ")");
      return bucksNext(null, false);
    }
  });
};

var rootController = {
  ready: function() {
    if (!utils.checkLogin() || !shared.data.user) {
      this.$broadcast("logout");
      return;
    }

    var _this = this;
    var lobbyId = shared.data.lobbyId;
    var rooms = shared.data.rooms;

    // TODO Here should be rewritten to be more user-friendly
    if (!lobbyId || !rooms.length) {
      console.warn("Internal error seems to have occurred.");
      shared.jumpers.error();
      return;
    }

    _this.$broadcast("app:sidebar:updateRooms", rooms);

    (new Bucks()).then(function(res, next) {
      enterRoom(_this, next, lobbyId);
    }).then(function(res, next) {
      if (!res) return next();
      fetchUsersAndMessages(_this, shared.data.currentRoomId);
      setupNewMessageListener(_this, shared.data.currentRoomId);
      return next();
    }).end();
  }
};

module.exports = rootController;
