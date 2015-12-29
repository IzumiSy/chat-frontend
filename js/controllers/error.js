var shared = require("../shard.js");

var errorController = {
  reload: function() {
    shared.jumpers.root();
  }
};

module.exports = errorController;

