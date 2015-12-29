var api = require("../api.js");
var shared = require("../shared.js");
var storage = require("../storage.js");

var headerController = {
  logout: function() {
    (new Bucks()).then(function(res, next) {
      // TODO
      // api.userRoomLeave(...)
      // return false when getting error
      return next(null, true);
    }).then(function(res, next) {
      if (!res) return next(null, false);
      storage.remove("token");
      shared.jumpers.entrance();
      return next(null, true);
    }).end();
  }
};

module.exports = headerController;
