import VueRouter from "vue-router";
import api from "./api.js";
import shared from "./shared.js";

import RootComponent from "./components/root/root.js";
import ErrorComponent from "./components/error/error.js";
import EntranceComponent from "./components/entrance/entrance.js";

// It is possible to map routings implicitly just by including
// route.js without creating mapRoutings(...) function, but it would
// be difficult to understand code stream in app.js if doing that.

Vue.use(VueRouter);
const routings = new VueRouter();

const jumpers = {
  root: function() {
    routings.go({ path: "/" });
  },

  entrance: function() {
    routings.go({ path: "/entrance" });
  },

  error: function() {
    routings.go({ path: "/error" });
  },

  jump: function(args) {
    if (args.path) {
      routings.go({ path: args.path });
    }
  }
};

export default {
  mapRoutings: function() {
    const app = Vue.extend({});

    routings.map({
      "/": {
        component: RootComponent
      },
      "/entrance": {
        component: EntranceComponent
      },
      "/error": {
        component: ErrorComponent
      }
    });

    // Handles non-mapped routing
    routings.redirect({
      '*': '/'
    });

    // Im not really sure about it, but shared object
    // gets clear after routings.start(...), so jumpers
    // have to be set just at here. Need more investigation.
    shared.jumpers = jumpers;

    routings.start(app, "body");

    console.info("[APP] Routings mapped.");
  }
};
