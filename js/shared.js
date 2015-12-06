app = require("./app.js");

var dataSharedService = {
  init: function(name) {
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
