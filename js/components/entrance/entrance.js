(function() {
  'use strict';

  require('./entrance.scss');

  var controller = require("./entranceController.js");
  var utils = require("../../utils.js");

  var entranceComponent = {
    template: require("./entrance.jade")(),

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
