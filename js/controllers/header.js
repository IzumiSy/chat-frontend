(function() {
  'use strict';

  var api = require("../api.js");
  var shared = require("../shared.js");
  var storage = require("../storage.js");

  // TODO Need any error handling here?
  var leaveTransaction = function() {
    var currentRoomId =
      shared.data.currentRoomId ? shared.data.currentRoomId : "all";
    api.userRoomLeave(currentRoomId, function() {});
    storage.remove("token");
    shared.jumpers.entrance();
  };

  var headerController = {
    created: function() {
      this.$on("logout", function(data) {
        leaveTransaction();
      });
    },

    logout: function() {
      leaveTransaction();
    }
  };

  module.exports = headerController;
})();
