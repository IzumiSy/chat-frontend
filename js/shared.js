app = require("./app.js");

var userDefinedService = {
  init: function(name) {
    Vue.prototype._$userDefinedServiceScope = {};
    Vue.util.defineReactive(app, "$userService",
      Vue.prototype._$userDefinedServiceScope);
    Vue.prototype._$setProperty = function(k, v) {
      Vue.set(this._$userDefinedServiceScope, k, v);
    };
    Vue.prototype._$removeProperty = function(k, v) {
      Vue.delete(this._$userDefinedServiceScope, k, v);
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

module.exports = userDefinedService;
