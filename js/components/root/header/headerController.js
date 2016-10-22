(function() {
  'use strict';

  var api = require("../../../api.js");
  var shared = require("../../../shared.js");
  var storage = require("../../../storage.js");

  // TODO Need any error handling here?
  var leaveTransaction = function(roomId) {
    api.userRoomLeave(roomId);
    storage.remove("token");
    shared.jumpers.entrance();
  };

  var headerController = {
    logout: function() {
      leaveTransaction("all");
    }
  };

  module.exports = headerController;
})();