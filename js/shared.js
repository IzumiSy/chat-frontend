(function() {
  'use strict';

  var sharedStructure = function() {
    var data = {};
    var jumpers = {};

    return {
      data: data,
      jumpers: jumpers
    };
  };

  module.exports = new sharedStructure();
})();
