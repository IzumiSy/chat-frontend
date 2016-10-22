(function() {
  'use strict';

  var controller = require("./headerController.js");

  var headerComponent = {
    template: require("./_header.jade")(),

    methods: {
      logout: controller.logout
    }
  };

  module.exports = headerComponent;
})();
