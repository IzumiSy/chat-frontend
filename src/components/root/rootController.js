(function() {
  'use strict';

  var api = require("../../api.js");
  var utils = require("../../utils.js");
  var shared = require("../../shared.js");
  var rocketio = require("../../rocketio.js");

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

  var roomDataSetup = function(_this, roomId) {
    _this.$broadcast("app:sidebar:setCurrentRoom", roomId);
    fetchUsersAndMessages(_this, roomId);
    rocketio.setupRocketIOListeners(_this, roomId);
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


  };

  module.exports = rootController;
})();
