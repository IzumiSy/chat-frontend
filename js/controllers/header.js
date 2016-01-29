(function() {
  'use strict';

  var api = require("../api.js");
  var shared = require("../shared.js");
  var storage = require("../storage.js");

  var listenersSetup = function(_this) {
    _this.$on("logout", function(data) {
      leaveTransaction();
    });
  };

  // TODO Need any error handling here?
  var leaveTransaction = function() {
    var currentRoomId =
      shared.data.currentRoomId ? shared.data.currentRoomId : "all";
    api.userRoomLeave(currentRoomId);
    storage.remove("token");
    shared.jumpers.entrance();
  };

  var headerController = {
    created: function() {
      listenersSetup(this);
    },

    logout: function() {
      leaveTransaction();
    }
  };

  module.exports = headerController;
})();
