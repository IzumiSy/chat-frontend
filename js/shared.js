(function() {
  'use strict';

  var SharedStructure = function() {
    return {
      jumpers: {},

      data: {
        channelMessages: {}
        currentRoomId: null,
        rocketio: {
          instance: null,
          listeners: {}
        },
      },

      FACE_ASSETS: [
        "1449951867",
        "1449951870",
        "1449951874",
        "1449951898",
        "1449951900",
        "1449951968",
        "1449951973"
      ]
    };
  };

  module.exports = new SharedStructure();
})();
