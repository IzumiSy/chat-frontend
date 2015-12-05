var api = require("./services/api.js");

module.exports = {

  // -----------------
  //  Page components
  // -----------------

  root: Vue.extend({
    template: require("./main.html")
  }),

  entrance: Vue.extend({
    template: require("./entrance.html"),
    methods: {
      enterRobby: function() {
        // Call api functions
      }
    }
   }),

   error: Vue.extend({
     template: null
   }),

   // --------------------
   //  Partial components
   // --------------------

  _partials: {
    header: Vue.extend({
      template: require("./components/_header.html")
    }),

    sidebar: Vue.extend({
      template: require("./components/_sidebar.html")
    }),

    messages: Vue.extend({
      template: require("./components/_messages.html")
    })
  }
};

