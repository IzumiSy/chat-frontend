module.exports = {
  root: Vue.extend({
    template: require("./main.html")
  }),

  entrance: Vue.extend({
    template: require("./entrance.html"),
    methods: {
      enterRobby: function() {
        var requestName = ""
        this.$http.get("/api/user/usable/" + requestName, function(d, stat, req) {
          // Handles HTTP request
        }).error(function(d, stat, req) {
          // Handles error
        });
      }
    }
   }),

  _partials: {
    header: Vue.extend({
      template: require("./components/_header.html")
    }),

    sidebar: Vue.extend({
      template: require("./components/_sidebar.html")
    }),

    messages: Vue.extend({
      template: require("./components/_messages.html")
    })
  }
};

