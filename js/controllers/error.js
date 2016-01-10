(function() {
  'use strict';

  var shared = require("../shared.js");
  var storage = require("../storage.js");

  var errorController = {
    created: function() {
      storage.remove("token");
    },

    reload: function() {
      shared.jumpers.entrance();
    }
  };

  module.exports = errorController;
})();
