var functions = {
  cacheData: {},

  isAvailable: function() {
    return !window.sessionStorage;
  },

  set: function(key, value) {
    if (window.sessionStorage) {
      return window.sessionStorage.setItem(key, value);
    }
  },

  get: function(key) {
    if (window.sessionStorage) {
      return window.sessionStorage.getItem(key);
    }
  },

  remove: function(key) {
    if (window.sessionStorage) {
      return window.sessionStorage.removeItem(key);
    }
  }
};

module.exports = functions;
