var _ = require("underscore");
var api = require("../api.js");
var utils = require("../utils.js");
var shared = require("../shared.js");

var rootController = {
  created: function() {
    var _this = this;
    var lobbyId = null;

    if (!utils.checkLogin()) {
      shared.jumpers.entrance();
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
      api.userRoomEnter(lobbyId, function(data, isSuccess) {
        if (isSuccess) {
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
