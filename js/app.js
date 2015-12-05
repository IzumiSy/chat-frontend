var components = require("./components.js");
var api        = require("./services/api.js");

Vue.use(VueRouter);
Vue.use(VueResource);

var app = new Vue({
  data: {
    id: null
  },
  created: function() {
    api.pingRequest();
  }
});

Vue.component("va-header", components._partials.header);
Vue.component("va-sidebar", components._partials.sidebar);
Vue.component("va-messages", components._partials.messages);

var router = new VueRouter();
router.map({
  "/": {
    component: components.root
  },
  "/entrance": {
    component: components.entrance
  }
});
router.start(app, ".main-view-wrapper");

