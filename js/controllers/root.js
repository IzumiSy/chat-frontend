(function() {
  'use strict';

  var api = require("../api.js");
  var utils = require("../utils.js");
  var shared = require("../shared.js");
  var rocketio = require("../rocketio.js");

  var fetchUsersAndMessages = function(_this, roomId) {
    api.getAllRooms().then(function(res) {
      _this.$broadcast("app:sidebar:updateRooms", res.data);
      shared.data.rooms = res.data;
    }, function(res) {
      console.warn("Error at api.getAllRooms");
    });
    api.getRoomUsers(roomId).then(function(res) {
      _this.$broadcast("app:sidebar:updateUsers", res.data);
      shared.data.currentRoomUsers = res.data;
    }, function() {
      console.warn("Error at api.getRoomUsers");
    });
  };

  var enterRoom = function(_this, _next, roomId) {
    api.userRoomEnter(roomId).then(function(res) {
      _this.$broadcast("app:sidebar:setCurrentRoom", roomId);
      shared.data.currentRoomId = roomId;
      return _next();
    }, function() {
      console.warn("Error at api.userRoomEnter: Id(" + roomId + ")");
      return _next(new Error(null))
    });
  };

  var roomDataSetup = function(_this, _next, roomId) {
    fetchUsersAndMessages(_this, roomId);
    rocketio.setupRocketIOListeners(_this, roomId);
    return _next();
  };

  var listenersSetup = function(_this) {
    _this.$on("app:root:fetchRoomData", function(roomId) {
      roomDataSetup(this, roomId);
    });
    _this.$on("app:root:newMessage", function() {
      _this.$broadcast("app:msgView:scrollBottom");
    });
    _this.$on("app:root:roomChange", function() {
      _this.$broadcast("app:msgView:roomChange");
      _this.$broadcast("app:msgInput:setFocus");
    });
  };

  var rootController = {
    created: function() {
      listenersSetup(this);
    },

    ready: function() {
      if (!shared.data.user) {
        shared.jumpers.entrance();
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

      Bucks.onError(function(e, bucks) {
        // noop
      });

      (new Bucks()).then(function(res, next) {
        enterRoom(_this, next, lobbyId);
      }).then(function(res, next) {
        roomDataSetup(_this, next, shared.data.currentRoomId);
      }).end();
    }
  };

  module.exports = rootController;
})();
