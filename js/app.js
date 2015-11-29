Vue.use(VueRouter);

var app = Vue.extend({});
var router = new VueRouter();

var components = {
  root: Vue.extend({
    template: require("./main.html")
  }),
  entrance: Vue.extend({
    template: require("./entrance.html")
  })
};

router.map({
  "/": {
    component: components.root
  },
  "/entrance": {
    component: components.entrance
  }
});
router.start(app, ".main-view-wrapper");

