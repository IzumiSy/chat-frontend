(function() {
  'use strict';

  var api = require("../api.js");
  var utils = require("../utils.js");
  var shared = require("../shared.js");

  var formatCreatedAtTime = function(data) {
    var date = new Date(data.created_at);
    data.formatted_created_at_time = (date.getHours() + ":" + date.getMinutes());
    return data;
  };

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

  var delegateRocketioListeners = function() {
    if (!shared.data.rocketio.instance) {
      return;
    }

    var listeners = Object.keys(shared.data.rocketio.listeners);
    if (listeners.length) {
      listeners.forEach(function(listener) {
        shared.data.rocketio.instance.removeListener(listener);
      });
    }
  };

  var setupNewMessageListener = function(_this, roomId) {
    delegateRocketioListeners();

    if (shared.data.rocketio.instance) {
      shared.data.rocketio.instance.close();
    }

    var listeners = {
      newMessage: function(data) {
        data = JSON.parse(data);
        formatCreatedAtTime(data);
        _this.$broadcast("app:msgView:addMessage", data);
        _this.$broadcast("app:msgView:scrollBottom");
      },

      updateRooms: function(data) {
        data = JSON.parse(data);
        _this.$broadcast("app:sidebar:updateRooms", data);
      },

      updateMembers: function(data) {
        data = JSON.parse(data);
        _this.$broadcast("app:sidebar:updateUsers", data);
      },

      userEnter: function(data) {
         // TODO Add a system message that someone got in to the room
      },

      userLeave: function(data) {
        // TODO Add a system message that someone left from the room
      }
    };

    shared.data.rocketio.instance = api.connectRocketIO(roomId);
    shared.data.rocketio.listeners = {
      newMessage: shared.data.rocketio.instance.on("newMessage", listeners.newMessage),
      updateRooms: shared.data.rocketio.instance.on("updateRooms", listeners.updateRooms),
      updateMembers: shared.data.rocketio.instance.on("updateMembers", listeners.updateMembers),
      userEnter: shared.data.rocketio.instance.on("userEnter", listeners.userEnter),
      userLeave: shared.data.rocketio.instance.on("userLeave", listeners.userLeave)
    };
  };

  var enterRoom = function(_this, bucksNext, roomId) {
    api.userRoomEnter(roomId).then(function(res) {
      _this.$broadcast("app:sidebar:setCurrentRoom", roomId);
      shared.data.currentRoomId = roomId;
      return bucksNext(null, true);
    }, function() {
      console.warn("Error at api.userRoomEnter: Id(" + roomId + ")");
      return bucksNext(null, false);
    });
  };

  var roomDataSetup = function(_this, roomId) {
    fetchUsersAndMessages(_this, roomId);
    setupNewMessageListener(_this, roomId);
  };

  var listenersSetup = function(_this) {
    _this.$on("app:root:fetchRoomData", function(roomId) {
      roomDataSetup(this, roomId);
    });
    _this.$on("app:root:newMessage", function() {
      _this.$broadcast("app:msgView:scrollBottom");
    });
  };

  var rootController = {
    created: function() {
      listenersSetup(this);
    },

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
        roomDataSetup(_this, shared.data.currentRoomId);
        return next();
      }).end();

      $(window).bind("beforeunload", function(e) {
        // TODO Set alert showing here to confirm of leaving and call leave transaction
      });
    }
  };

  module.exports = rootController;
})();
