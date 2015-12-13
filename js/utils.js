var storage = require("./storage.js")

var functions = {
  checkLogin: function() {
    token = storage.get("token")
    if (!token) {
      // jump to entrance
    }
  }
}

module.exports = functions;
