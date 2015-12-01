var components = require("./components.js");

var app = Vue.extend({});
var router = new VueRouter();

Vue.use(VueRouter);

Vue.component("va-header", components._partials.header);
Vue.component("va-sidebar", components._partials.sidebar);
Vue.component("va-messages", components._partials.messages);

router.map({
  "/": {
    component: components.root
  },
  "/entrance": {
    component: components.entrance
  }
});
router.start(app, ".main-view-wrapper");

