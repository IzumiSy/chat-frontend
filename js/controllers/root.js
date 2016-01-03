var _ = require("underscore");
var api = require("../api.js");
var utils = require("../utils.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var fetchUsersAndMessages = function(_this, roomId) {
  api.getRoomUsers(roomId, function(data, isSuccess) {
    if (isSuccess && data) {
      _this.$broadcast("app:sidebar:updateUsers", data);
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

/*
var prefetchSelfData = function() {
  api.getSelfData(function(data, isSuccess) {
    if (isSuccess) {
      shared.data.user = data;
    } else {
      // TODO Needed to redirecto to error page?
      console.warn("Error at getSelfData");
    }
  });
};
*/

var enterRoom = function(_this, bucksNext, roomId) {
  api.userRoomEnter(roomId, function(data, isSuccess) {
    if (isSuccess) {
      _this.$broadcast("app:sidebar:setCurrentRoom", roomId);
      storage.set("currentRoomId", roomId);
      return bucksNext(null, true);
    } else {
      console.warn("Error at api.userRoomEnter: Id(" + roomId + ")");
      return bucksNext(null, false);
    }
  });
};

var rootController = {
  ready: function() {
    if (!utils.checkLogin()) {
      shared.jumpers.entrance();
      return;
    }

    var _this = this;
    var lobbyId = null;
    var currentRoomId = storage.get("currentRoomId");

    if (!shared.data.user) {
      _this.$broadcast("logout");
      return;
    }

    if (currentRoomId) {
      fetchUsersAndMessages(_this, currentRoomId);
    }

    (new Bucks()).then(function(res, next) {
      api.getAllRooms(function(data, isSuccess) {
        if (!isSuccess || !data) {
          console.warn("Error at api.getAllRooms");
          return next(null, false);
        } else if (!data.length) {
          console.warn("Lobby room not found");
          shared.jumpers.error();
          return;
        }
        _this.rooms = data;
        _this.$broadcast("app:sidebar:updateRooms", data);
        lobbyId = _.find(_this.rooms, function(r) { return r.name == "Lobby"; })._id;
        return next(null, true);
      });
    }).then(function(res, next) {
      if (!res) return next(null, false);
      var currentRoomId = storage.get("currentRoomId");
      var roomId = currentRoomId ? currentRoomId : lobbyId;
      enterRoom(_this, next, roomId);
    }).then(function(res, next) {
      if (res) return next();
      enterRoom(_this, next, lobbyId);
    }).then(function(res, next) {
      if (!currentRoomId) {
        currentRoomId = storage.get("currentRoomId");
        fetchUsersAndMessages(_this, currentRoomId);
      }
      return next();
    }).end();
  }
};

module.exports = rootController;
