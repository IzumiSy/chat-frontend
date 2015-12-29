var shared = require("../shared.js");

var errorController = {
  reload: function() {
    shared.jumpers.entrance();
  }
};

module.exports = errorController;

