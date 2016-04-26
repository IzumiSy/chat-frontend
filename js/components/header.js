(function() {
  'use strict';

  var controller = require("./controllers/header.js");

  var headerComponent = {
    template: require("../_header.html"),

    methods: {
      logout: controller.logout
    }
  };

  module.exports = headerComponent;
})();
