(function() {
  'use strict';

  var controllers = require("./controllers.js");

  // --------------------
  //  Partial components
  // --------------------
  var _partials = {
    header: {
      template: require("./components/_header.html"),
      created: controllers.partials.header.created,
      methods: {
        logout: controllers.partials.header.logout
      }
    },

    sidebar: {
      template: require("./components/_sidebar.html"),
      data: function() {
        return {
          rooms: [],
          users: [],
          currentUser: null,
          currentRoomId: null,
          currentFace: null
        };
      },
      created: controllers.partials.sidebar.created,
      ready: controllers.partials.sidebar.ready,
      methods: {
        onRoomClicked: controllers.partials.sidebar.onRoomClicked,
        onUserClicked: controllers.partials.sidebar.onUserClicked
      }
    },

    message_view: {
      template: require("./components/_message_view.html"),
      data: function() {
        return {
          messages: []
        };
      },
      methods: {
        isPrevUserSame: controllers.partials.messageView.isPrevUserSame
      },
      ready: controllers.partials.messageView.ready
    },

    message_input: {
      template: require("./components/_message_input.html"),
      data: function() {
        return {
          message: null
        };
      },
      methods: {
        sendMessage: controllers.partials.messageInput.sendMessage
      },
      ready: controllers.partials.messageInput.ready
    }
  };

  // -----------------
  //  Page components
  // -----------------
  var _pages = {
    root: {
      components: {
        "va-header": _partials.header,
        "va-sidebar": _partials.sidebar,
        "va-message-view": _partials.message_view,
        "va-message-input": _partials.message_input
      },
      data: function() {
        return {
          rooms: [],
          msgListener: null
        };
      },
      template: require("./main.html"),
      created: controllers.root.created,
      ready: controllers.root.ready
    },

    entrance: {
      template: require("./entrance.html"),
      data: function() {
        return {
          username: null,
          message:  null,
          error:    false
        };
      },
      methods: {
        enterRobby: controllers.entrance.enterRobby
      },
      created: controllers.entrance.created,
      ready: controllers.entrance.ready
    },

    error: {
      template: require("./error.html"),
      created: controllers.error.created,
      methods: {
        reload: controllers.error.reload
      }
    }
  };

  module.exports = {
    pages: _pages,
    partials: _partials
  };
})();
