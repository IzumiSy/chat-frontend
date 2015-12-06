var controllers = require("./controllers.js");

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
        controllers.entrance.enterRobby(this);
      }
    },
    created: controllers.entrance.created
   }),

   error: Vue.extend({
     template: require("./error.html")
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
