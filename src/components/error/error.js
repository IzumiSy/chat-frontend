(function() {
  'use strict';

  require('./error.scss');

  var shared = require("../../shared.js");
  var storage = require("../../storage.js");

  var errorComponent = {
    template: require("./error.jade")(),

    created: function() {
      storage.remove("token");
    },

    methods: {
      reload: function() {
        shared.jumpers.entrance();
      }
    }
  };

  module.exports = errorComponent;
})();
