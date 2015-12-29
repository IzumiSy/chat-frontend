var api = require("../api.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var headerController = {
  logout: function() {
    var currentRoomId = storage.get("currentRoomId");

    (new Bucks()).then(function(res, next) {
      // TODO Need any error handling here?
      api.userRoomLeave(currentRoomId, function(data, isSuccess) {
        return next();
      });
    }).then(function(res, next) {
      storage.remove("token");
      shared.jumpers.entrance();
      return next();
    }).end();
  }
};

module.exports = headerController;
