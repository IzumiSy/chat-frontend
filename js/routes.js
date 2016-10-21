(function() {
  'use strict';

  var VueRouter = require("vue-router");

  var api = require("./api.js");
  var shared = require("./shared.js");

  var components = {
    root:     require("./components/root.js"),
    error:    require("./components/error.js"),
    entrance: require("./components/entrance.js")
  };

  // It is possible to map routings implicitly just by including
  // route.js without creating mapRoutings(...) function, but it would
  // be difficult to understand code stream in app.js if doing that.

  Vue.use(VueRouter);
  var routings = new VueRouter();

  var jumpers = {
    root: function() {
      routings.go({ path: "/" });
    },

    entrance: function() {
      routings.go({ path: "/entrance" });
    },

    error: function() {
      routings.go({ path: "/error" });
    },

    jump: function(args) {
      if (args.path) {
        routings.go({ path: args.path });
      }
    }
  };

  module.exports = {
    mapRoutings: function() {
      var app = Vue.extend({});

      routings.map({
        "/": {
          component: components.root
        },
        "/entrance": {
          component: components.entrance
        },
        "/error": {
          component: components.error
        }
      });

      // Handles non-mapped routing
      routings.redirect({
        '*': '/'
      });

      // Im not really sure about it, but shared object
      // gets clear after routings.start(...), so jumpers
      // have to be set just at here. Need more investigation.
      shared.jumpers = jumpers;

      routings.start(app, "body");

      console.info("[APP] Routings mapped.");
    }
  };
})();
