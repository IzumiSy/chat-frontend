var app = require("./app.js");

// Vue.util.defineReactive(...) is actually not seemed
// able to be used from user side, because it is inner API
// of Vue.js to create reactive object.

var dataSharedService = {
  init: function(app) {
    Vue.prototype._$userSharedServiceScope = {};
    Vue.util.defineReactive(app, "$userService",
      Vue.prototype._$userSharedServiceScope);
    Vue.prototype._$setProperty = function(k, v) {
      Vue.set(this._$userSharedServiceScope, k, v);
    };
    Vue.prototype._$removeProperty = function(k, v) {
      Vue.delete(this._$userSharedServiceScope, k, v);
    };
  },

  set: function(key, value) {
    Vue.prototype._$setProperty(key, value);
  },

  remove: function(key) {
    Vue.prototype._$removeProperty(key);
  },

  get: function(key) {
    return Vue.prototype._$userSharedServiceScope[key];
  }
};

module.exports = dataSharedService;
