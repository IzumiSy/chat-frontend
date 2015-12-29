var _ = require("underscore");
var api = require("../api.js");
var utils = require("../utils.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var rootController = {
  created: function() {
    if (!utils.checkLogin()) {
      shared.jumpers.entrance();
      return;
    }

    var _this = this;
    var lobbyId = null;

    if (!shared.data.user) {
      var token = storage.get("token");
      api.getSelfData(token, function(data, isSuccess) {
        if (isSuccess) {
          shared.data.user = data;
        } else {
          // TODO Needed to redirecto to error page?
          console.warn("Error at getSelfData");
        }
      });
    }

    (new Bucks()).then(function(res, next) {
      api.getAllRooms(function(data, isSuccess) {
        if (!isSuccess || !data || !data.length) {
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

      // Tries to enter the room from the roomId recorded in localStorage
      var currentRoomId = storage.get("currentRoomId");
      var roomId = currentRoomId ? currentRoomId : lobbyId;
      api.userRoomEnter(roomId, function(data, isSuccess) {
        if (isSuccess) {
          _this.$broadcast("app:sidebar:setCurrentRoom", roomId);
          storage.set("currentRoomId", roomId);
          return next(null, true);
        } else {
          console.warn("Error at api.userRoomEnter: Id(" + lobbyId + ")");
          return next(null, false);
        }
      });
    }).then(function(res, next) {
      if (res) return next();

      // If the user failed to enter the previous room
      // here leads him/her to the Lobby room
      api.userRoomEnter(lobbyId, function(data, isSuccess) {
        if (isSuccess) {
          _this.$broadcast("app:sidebar:setCurrentRoom", lobbyId);
          storage.set("currentRoomId", lobbyId);
        } else {
          console.warn("Failed to enter Lobby channel");
          shared.jumpers.error();
        }
        return next();
      });
    }).end();
  }
};

module.exports = rootController;
