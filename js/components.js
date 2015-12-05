var api = require("./services/api.js");

var actions = {
  enterRobby:  function(rootObject) {
    if (!rootObject.name) {
      // show an error message
      return;
    }

    api.createNewUser(rootObject.username, function(data, isError) {
      if (!isError) {
        console.log(data);
      } else {
        console.log("error");
      }
    });
  }
};

module.exports = {

  // -----------------
  //  Page components
  // -----------------

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

