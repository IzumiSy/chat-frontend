var api = require("./api.js");
var router = require("./routes.js");
var shared = require("./shared.js");
var storage = require("./storage.js");

Vue.use(VueRouter);
Vue.use(VueResource);

shared.init();
router.mapRoutings();

var app = new Vue({
  created: function() {
    if (!storage.isAvailable) {
      // Show a message that says "Your browser cannot browse this page"
    }
  }
});

module.exports = app;
