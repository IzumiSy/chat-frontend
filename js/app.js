(function() {
  'use strict';

  require('normalize-css');
  require('./app.scss');

  var api     = require("./api.js");
  var router  = require("./routes.js");
  var storage = require("./storage.js");

  var components = {
    root:    require("./components/root/root.js"),
    error:   require("./components/error/error.js"),
    entrace: require("./components/entrance/entrance.js")
  };

  var app = new Vue({
    components: {
      "va-root-view":     components.root,
      "va-error-view":    components.error,
      "va-entrance-view": components.entrance
    },

    created: function() {
      if (!WebSocket) {
        console.error("Your browser seems not compatible with WebSocket");
        // Show an alert that says "Your browser cannot browse this page"
      }

      router.mapRoutings();

      console.info("[APP] App created.");
    }
  });
})();
