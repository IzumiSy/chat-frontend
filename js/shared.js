(function() {
  'use strict';

  var SharedStructure = function() {
    var jumpers = {};
    var data = {
      currentRoomId: null,
      rocketio: {
        instance: null,
        listeners: {}
      },
      channel_messages: []
    };

    return {
      data: data,
      jumpers: jumpers
    };
  };

  module.exports = new SharedStructure();
})();
