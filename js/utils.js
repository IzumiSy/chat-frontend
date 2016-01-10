(function() {
  'use strict';

  var storage = require("./storage.js");

  var functions = {
    checkLogin: function() {
      var token = storage.get("token");
      if (token) {
        return true;
      } else {
        return false;
      }
    }
  };

  module.exports = functions;
})();
