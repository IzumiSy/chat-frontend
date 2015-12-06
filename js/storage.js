var functions = {
  isAvailable: function() {
    return !window.sessionStorage;
  },

  set: function(key, value) {
    if (window.sessionStorage) {
      window.sessionStorage.setItem(key, value);
    }
  },

  get: function(key) {
    if (window.sessionStorage) {
      window.sessionStorage.getItem(key);
    }
  },

  remove: function(key) {
    if (window.sessionStorage) {
      window.sessionStorage.removeItem(key);
    }
  }
};

module.exports = functions;
