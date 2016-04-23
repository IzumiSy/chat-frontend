(function() {
  'use strict';

  var controllers = require("./controllers/entrance.js")
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

    ready: controllers.entrance.ready,

    methods: {
      enterRobby: controllers.entrance.enterRobby,
      selectFace: controllers.entrance.selectFace,
      attrFaceAsset: utils.attrFaceAsset
    }
  }

  module.exports = entranceComponent;
})();
