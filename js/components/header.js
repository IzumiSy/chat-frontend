(function() {
  'use strict';

  var controllers = require("./controllers/header.js");

  var headerComponent = {
    template: require("../_header.html"),

    methods: {
      logout: controllers.partials.header.logout
    }
  };

  module.export = headerComponent;
})()
