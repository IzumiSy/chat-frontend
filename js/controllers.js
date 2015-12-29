var controllers = {
  root:     require("./controllers/root.js"),
  error:    require("./controllers/error.js"),
  entrance: require("./controllers/entrance.js"),

  partials: {
    messageInput: require("./controllers/messageInput.js"),
    header:       require("./controllers/header.js"),
    sidebar:      require("./controllers/sidebar.js")
  }
};

module.exports = controllers;
