var api = require("./api.js");
var user = require("./user.js");
var router = require("./routes.js");

Vue.use(VueRouter);
Vue.use(VueResource);

var app = new Vue({
  created: function() {
    if (!window.localStorage) {
      // Show a message that says "Your browser cannot browse this page"
    }

    api.pingRequest(function(data, isSucceed) {
      if (!isSucceed) {
        // Jump to error page
      }

      user.init();
      user.set("id", null);
    });
  }
});

module.exports = app;

