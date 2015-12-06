var components = require("./components.js");
var app = require("./app.js");

// It is possible to map routings implicitly just by including
// route.js without creating mapRoutings(...) function, but it would
// be difficult to understand code stream in app.js if doing that.

module.exports = {
  mapRoutings: function() {
    var router = new VueRouter();

    router.map({
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

    router.start(app, ".main-view-wrapper");
  }
};
