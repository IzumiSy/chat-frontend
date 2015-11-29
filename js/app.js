Vue.use(VueRouter);

var router = new VueRouter({
  history: true,
  saveScrollPosition: true
});

var app = new Vue({
  el: ".main-view",
  data: {
    text: "Hello World"
  }
});

