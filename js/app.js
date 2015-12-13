var api = require("./api.js");
var router = require("./routes.js");
var components = require("./components.js");
var shared = require("./shared.js");
var storage = require("./storage.js");

Vue.use(VueRouter);
Vue.use(VueResource);

var app = new Vue({
  components: {
    "va-root-view": components.pages.root,
    "va-entrance-view": components.pages.entrance,
    "va-error-view": components.pages.error
  },

  created: function() {
    if (!storage.isAvailable) {
      // Show a message that says "Your browser cannot browse this page"
    }

    shared.init();
    router.mapRoutings(this);
  }
});

module.exports = app;
