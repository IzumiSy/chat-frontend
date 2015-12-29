var _ = require("underscore");
var api = require("../api.js");
var utils = require("../utils.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var rootController = {
  created: function() {
    var _this = this;
    var lobbyId = null;

    if (!utils.checkLogin()) {
      shared.jumpers.entrance();
    }

    if (!shared.data.user) {
      // fetch user data again
    }

    // Always an user enters Lobby at the first time when logging in.
    (new Bucks()).then(function(res, next) {
      api.getAllRooms(function(data, isSuccess) {
        if (!isSuccess || !data) {
          console.warn("Error at api.getAllRooms");
          return next(null, false);
        }
        _this.rooms = data;
        _this.$broadcast("app:sidebar:updateRooms", data);
        lobbyId = _.find(_this.rooms, function(r) { return r.name == "Lobby"; }).id;
        return next(null, true);
      });
    }).then(function(res, next) {
      if (!res) return next(null, false);
      var currentRoomId = storage.get("currentRoomId");
      var roomId = currentRoomId ? currentRoomId : lobbyId;
      api.userRoomEnter(roomId, function(data, isSuccess) {
        if (isSuccess) {
          var _data = { room_id: roomId, users_count: data.users_count };
          _this.$broadcast("app:sidebar:usersUpdate", _data);
          storage.set("currentRoomId", roomId);
          return next(null, true);
        } else {
          console.warn("Error at api.userRoomEnter: Id(" + lobbyId + ")");
          return next(null, false);
        }
      });
    }).end();
  }
};

module.exports = rootController;
