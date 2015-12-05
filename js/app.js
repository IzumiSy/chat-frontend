var api = require("./services/api.js");
var routes = require("./routes.js");

Vue.use(VueRouter);
Vue.use(VueResource);

routes.setupMapping();

var app = new Vue({
  data: {
    id: null
  },
  created: function() {
    if (!window.localStorage) {
      // Show a message that says "Your browser cannot browse this page"
    }

    api.pingRequest(function(data, isError) {
      if (isError) {
        // Jump to error page
      }
    });
  }
});

module.exports = app;

