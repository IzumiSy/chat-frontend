Vue.use(VueRouter);

var app = Vue.extend({});
var router = new VueRouter();

// TODO
// templates should be replaced
// with contents of jade files.
var components = {
  root: Vue.extend({
    template: "<div>root</div>"
  }),
  enterance: Vue.extend({
    template: "<div>enterance</div>"
  })
};

router.map({
  "/": {
    component: components.root
  },
  "/enter": {
    component: components.enterance
  }
});
router.start(app, ".main-view-wrapper");

