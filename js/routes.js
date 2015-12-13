var components = require("./components.js");
var api = require("./api.js");

// It is possible to map routings implicitly just by including
// route.js without creating mapRoutings(...) function, but it would
// be difficult to understand code stream in app.js if doing that.

var routings = null;
var events = null;

var setupEvents = function(routings) {
  return {
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
};

module.exports = {
  mapRoutings: function(app) {
    routings = new VueRouter();
    events = setupEvents(routings);

    routings.map({
      "/": {
        component: components.pages.root
      },
      "/entrance": {
        component: components.pages.entrance
      },
      "/error": {
        component: components.pages.error
      }
    });

    // Always run ping check before transitions
    routings.beforeEach(function() {
      api.pingRequest(function(data, isSucceed) {
        if (!isSucceed) {
          events.error();
        }
      });
    });

    routings.start(app, "body");
  }
};
