var api = require("./api.js");
var router = require("./routes.js");
var shared = require("./shared.js");
var storage = require("./storage.js");

Vue.use(VueRouter);
Vue.use(VueResource);

var app = new Vue({
  ready: function() {
    shared.init();
    router.mapRoutings();
  },

  created: function() {
    if (!storage.isAvailable) {
      // Show a message that says "Your browser cannot browse this page"
    }
  }
});

module.exports = app;
