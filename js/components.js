var api = require("./services/api.js");
var app = require("./app.js");

var actions = {
  enterRobby:  function(rootObject) {
    if (!rootObject.username) {
      // Shows an error message
      return;
    }

    api.createNewUser(rootObject.username, function(data, isSucceed) {
      if (isSucceed) {
        // Extracts token from returned data and store it to localStorage.
        // Jump to the main chat page
      } else {
        // Shows an error message
      }
    });
  }
};

// -----------------
//  Page components
// -----------------
var _pages = {
  root: Vue.extend({
    template: require("./main.html")
  }),

  entrance: Vue.extend({
    template: require("./entrance.html"),
    data: function() {
      return {
        username: null
      };
    },
    methods: {
      enterRobby: function() {
        actions.enterRobby(this);
      }
    }
   }),

   error: Vue.extend({
     template: null // TODO: create tempate
   })
};

// --------------------
//  Partial components
// --------------------
var _partials = {
  header: Vue.extend({
    template: require("./components/_header.html")
  }),

  sidebar: Vue.extend({
    template: require("./components/_sidebar.html")
  }),

  messages: Vue.extend({
    template: require("./components/_messages.html")
  })
};

Vue.component("va-header", _partials.header);
Vue.component("va-sidebar", _partials.sidebar);
Vue.component("va-messages", _partials.messages);

module.exports = {
  pages: _pages,
  partials: _partials
};
