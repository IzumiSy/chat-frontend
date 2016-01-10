(function() {
  'use strict';

  var SharedStructure = function() {
    var data = {};
    var jumpers = {};

    return {
      data: data,
      jumpers: jumpers
    };
  };

  module.exports = new SharedStructure();
})();
