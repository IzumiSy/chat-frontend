(function() {
  'use strict';

  var controllers = require("./controllers.js");

  var headerComponent = {
    template: require("./components/_header.html"),

    methods: {
      logout: controllers.partials.header.logout
    }
  };

  module.export = headerComponent;
})()
