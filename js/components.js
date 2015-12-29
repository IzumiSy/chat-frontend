var controllers = require("./controllers.js");

// --------------------
//  Partial components
// --------------------
var _partials = {
  header: {
    template: require("./components/_header.html"),
    methods: {
      logout: controllers.partials.header.logout
    }
  },

  sidebar: {
    template: require("./components/_sidebar.html"),
    data: function() {
      return {
        rooms: []
      };
    },
    created: controllers.partials.sidebar.created
  },

  message_view: {
    template: require("./components/_message_view.html")
  },

  message_input: {
    template: require("./components/_message_input.html"),
    methods: {
      sendMessage: controllers.partials.messageInput.sendMessage
    }
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
        rooms: []
      };
    },
    template: require("./main.html"),
    created: controllers.root.created
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
    created: controllers.entrance.created
  },

  error: {
    template: require("./error.html"),
    methods: {
      reload: controllers.error.reload
    }
  }
};

module.exports = {
  pages: _pages,
  partials: _partials
};
