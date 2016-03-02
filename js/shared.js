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
      "149951867",
      "149951870",
      "149951874",
      "149951898",
      "149951900",
      "149951968",
      "149951973"
    ];

    return {
      data: data,
      jumpers: jumpers,
      FACE_ASSETS: faces
    };
  };

  module.exports = new SharedStructure();
})();
