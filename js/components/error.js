(function() {
  'use strict';

  var controller = require("./controllers/error.js");

  var errorComponent = {
    template: require("./error.jade"),

    created: controller.created,

    methods: {
      reload: controller.reload
    }
  };

  module.exports = errorComponent;
})();
