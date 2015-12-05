var api = require("./services/api.js");
var router = require("./routes.js");

Vue.use(VueRouter);
Vue.use(VueResource);

var app = new Vue({
  data: {
    id: null
  },
  created: function() {
    if (!window.localStorage) {
      // Show a message that says "Your browser cannot browse this page"
    }

    api.pingRequest(function(data, isSucceed) {
      if (isSucceed) {
        // Jump to error page
      }
    });
  }
});

module.exports = app;

