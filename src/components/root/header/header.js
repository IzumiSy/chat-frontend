(function() {
  'use strict';

  var api = require("../../../api.js");
  var shared = require("../../../shared.js");
  var storage = require("../../../storage.js");

  var controller = require("./headerController.js");

  var headerComponent = {
    template: require("./_header.jade")(),

    methods: {
      logout: function() {
        api.userRoomLeave("all");
        storage.remove("token");
        shared.jumpers.entrance();
      }
    }
  };

  module.exports = headerComponent;
})();
