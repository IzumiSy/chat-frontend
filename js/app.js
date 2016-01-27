(function() {
  'use strict';

  var api = require("./api.js");
  var router = require("./routes.js");
  var components = require("./components.js");
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
      if (!WebSocket || !WebSocketIO) {
        console.error("Your browser seems not compatible with WebSocket");
        // Show an alert that says "Your browser cannot browse this page"
      }

      router.mapRoutings(this);
    }
  });
})();
