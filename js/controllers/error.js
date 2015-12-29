var shared = require("../shared.js");

var errorController = {
  reload: function() {
    shared.jumpers.root();
  }
};

module.exports = errorController;

