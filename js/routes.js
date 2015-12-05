var components = require("./components.js");
var app = require("./app.js");

module.exports = {
  setupMapping: function() {
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
}

