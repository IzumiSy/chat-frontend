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
    data: function() {
      return {
        username: null
      };
    },
    methods: {
      enterRobby: function() {
        if (this.username) {
          api.createNewUser(this.username, function(data, isError) {
            if (!isError) {
              console.log(data);
            }
            else {
              console.log("error");
            }
          });
        }
        else {
          // Show error message
        }
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

