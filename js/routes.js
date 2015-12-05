var components = require("./components.js");
var app = require("./app.js");

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

module.exports = router;
