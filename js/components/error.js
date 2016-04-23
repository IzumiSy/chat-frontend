(function() {
  'use strict';

  var controllers = require("./controller/error.js")

  var errorComponent = {
    template: require("../error.html"),

    created: controllers.error.created,

    methods: {
      reload: controllers.error.reload
    }
  }

  module.export = errorComponent
})()
