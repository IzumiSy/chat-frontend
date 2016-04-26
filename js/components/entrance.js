(function() {
  'use strict';

  var controller = require("./controllers/entrance.js");
  var utils = require("../utils.js");

  var entranceComponent = {
    template: require("../entrance.html"),

    data: function() {
      return {
        previousInput: null,
        resWaiting:    true,
        currentView:   1,
        username:      null,
        message:       null,
        error:         false,
        faces:         []
      };
    },

    watch: {
      "username": function() {
        this.previousInput = this.username;
      }
    },

    ready: controller.ready,

    methods: {
      enterRobby: controller.enterRobby,
      selectFace: controller.selectFace,
      attrFaceAsset: utils.attrFaceAsset
    }
  };

  module.exports = entranceComponent;
})();
