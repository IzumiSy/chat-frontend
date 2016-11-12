import 'babel-polyfill';
import 'bootstrap';
import 'nanoscroller';

import 'normalize-css';
import 'flat-ui/bootstrap/css/bootstrap.css';
import 'flat-ui/css/flat-ui.css';
import 'spinkit/css/spinkit.css';
import 'nanoscroller/bin/css/nanoscroller.css';
import './app.scss';

import router from "./routes.js";

import RootComponent from "./components/root/root.js";
import ErrorComponent from "./components/error/error.js";
import EntranceComponent from "./components/entrance/entrance.js";

new Vue({
  components: {
    "va-root-view":     RootComponent,
    "va-error-view":    ErrorComponent,
    "va-entrance-view": EntranceComponent
  },

  created: function() {
    router.mapRoutings();
    console.info("[APP] App created.");
  }
});
