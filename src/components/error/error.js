(function() {
  'use strict';

  require('./error.scss');

  var controller = require("./errorController.js");

  var errorComponent = {
    template: require("./error.jade")(),

    created: controller.created,

    methods: {
      reload: controller.reload
    }
  };

  module.exports = errorComponent;
})();
