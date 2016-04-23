(function() {
  'use strict';

  var controller = require("./controllers/error.js");

  var errorComponent = {
    template: require("../error.html"),

    created: controller.created,

    methods: {
      reload: controller.reload
    }
  };

  module.export = errorComponent;
})();
