(function() {
  'use strict';

  var SharedStructure = function() {
    var jumpers = {};
    var data = {
      rocketio: {
        instance: null,
        listeners: {
          newMessage: null,
          updateRooms: null,
          userEnter: null,
          userLeave: null
        }
      }
    };

    return {
      data: data,
      jumpers: jumpers
    };
  };

  module.exports = new SharedStructure();
})();
