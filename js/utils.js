var storage = require("./storage.js");

var functions = {
  checkLogin: function() {
    token = storage.get("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = functions;
