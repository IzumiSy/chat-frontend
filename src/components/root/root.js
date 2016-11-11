(function() {
  'use strict';

  require('./root.scss');

  var controller = require("./rootController.js");

  var components = {
    header:       require("./header/header.js"),
    sidebar:      require("./sidebar/sidebar.js"),
    messageView:  require("./messageView/messageView.js"),
    messageInput: require("./messageInput/messageInput.js")
  };

  var rootComponent = {
    template: require("./root.jade")(),

    components: {
      "va-header":        components.header,
      "va-sidebar":       components.sidebar,
      "va-message-view":  components.messageView,
      "va-message-input": components.messageInput
    },

    data: function() {
      return {
        rooms: [],
        msgListener: null
      };
    },

    created: function() {
      listenersSetup(this);
      console.info("[APP] Root created.");
    },

    ready: function() {
      if (!shared.data.user) {
        shared.jumpers.entrance();
        return;
      }
      roomDataSetup(this, shared.data.currentRoomId);
      console.info("[APP] Root ready.");
    },

    methods: {
      listenersSetup: function() {
        var _this = this;

        this.$on("app:root:fetchRoomData", function(roomId) {
          roomDataSetup(_this, roomId);
        });
        this.$on("app:root:newMessage", function() {
          _this.$broadcast("app:msgView:scrollBottom");
        });
        this.$on("app:root:roomChange", function() {
          _this.$broadcast("app:msgView:roomChange");
          _this.$broadcast("app:msgInput:setFocus");
        });
      }
    }
  };

  module.exports = rootComponent;
})();
