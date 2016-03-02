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
      channel_messages: {}
    };
    var faces = [
      "1449951867",
      "1449951870",
      "1449951874",
      "1449951898",
      "1449951900",
      "1449951968",
      "1449951973"
    ];

    return {
      data: data,
      jumpers: jumpers,
      FACE_ASSETS: faces
    };
  };

  module.exports = new SharedStructure();
})();
