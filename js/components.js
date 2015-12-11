var controllers = require("./controllers.js");

// -----------------
//  Page components
// -----------------
var _pages = {
  root: Vue.extend({
    template: require("./main.html"),
    created: controllers.root.created
  }),

  entrance: Vue.extend({
    template: require("./entrance.html"),
    data: function() {
      return {
        username: null
      };
    },
    methods: {
      enterRobby: controllers.entrance.enterRobby
    },
    created: controllers.entrance.created
   }),

   error: Vue.extend({
     template: require("./error.html"),
     methods: {
       reload: controllers.error.reload
     }
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

  message_view: Vue.extend({
    template: require("./components/_message_view.html")
  }),

  message_input: Vue.extend({
    template: require("./components/_message_input.html")
  })
};

module.exports = {
  pages: _pages,
  partials: _partials,

  setupPartials: function() {
    Vue.component("va-header", _partials.header);
    Vue.component("va-sidebar", _partials.sidebar);
    Vue.component("va-message-view", _partials.message_view);
    Vue.component("va-message-input", _partials.message_input);
  }
};
