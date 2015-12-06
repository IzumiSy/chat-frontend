var app = require("./app.js");
var api = require("./api.js");
var service = require("./service.js");

var actions = {
  entrance: {
    enterRobby:  function(rootObject) {
      if (!rootObject.username) {
        // Shows an error message
        return;
      }

      api.createNewUser(rootObject.username, function(data, isSucceed) {
        if (isSucceed) {
          // Jump to the main chat page
        } else {
          // Shows an error message
        }
      });
    },

    created: function() {
      // Checks if userId has already set or not
    }
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
        actions.entrance.enterRobby(this);
      }
    },
    created: actions.entrance.created
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
