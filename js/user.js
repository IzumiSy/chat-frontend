app = require("./app.js");

var userService = {
  init: function() {
    Vue.prototype._$userServiceScope = {};
    Vue.util.defineReactive(app, "$userService", Vue.prototype._$userServiceScope);
    Vue.prototype._$setProperty = function(k, v) {
      Vue.set(this._$userServiceScope, k, v);
    };
    Vue.prototype._$removeProperty = function(k, v) {
      Vue.delete(this._$userServiceScope, k, v);
    };
  },

  set: function(key, value) {
    Vue.prototype._$setProperty(key, value);
  },

  remove: function(key) {
    Vue.prototype._$removeProperty(key);
  },

  get: function(key) {
    return Vue.prototype._$userServiceScope[key];
  }
};

module.exports = userService;
