Vue.use(VueRouter);

var components = require("./components.js");
var router = new VueRouter();
var app = new Vue({
  data: {
    id: null
  },
  created: function() {
    console.log("Vue object created.")
  }
});

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

