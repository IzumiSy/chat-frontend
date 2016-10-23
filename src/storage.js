(function() {
  'use strict';

  var shared = require("./shared.js");

  // If the browse does not support localStorage
  // storage module wraps straging with shared.js module
  var functions = {
    isAvailable: function() {
      isStorageAvailable = !window.sessionStorage;
      if (!isStorageAvailable) {
        shared.data.storageData = [];
      }
      return isStorageAvailable;
    },

    set: function(key, value) {
      var item;
      if (window.sessionStorage) {
        item = window.sessionStorage.setItem(key, value);
      } else {
        item = { key: key, value: value };
        shared.data.storageData[key] = value;
      }
      return item;
    },

    get: function(key) {
      var item;
      if (window.sessionStorage) {
        item = window.sessionStorage.getItem(key);
      } else {
        item = shared.data.storageData[key];
      }
      return item;
    },

    remove: function(key) {
      if (window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      } else {
        delete shared.data.storageData[key];
      }
    }
  };

  module.exports = functions;
})();
