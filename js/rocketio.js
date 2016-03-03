(function() {
  var shared = require("./shared.js");
  var api = require("./api.js");
  var utils = require("./utils.js");

  var delegateRocketioListeners = function() {
    if (!shared.data.rocketio.instance) {
      return;
    }

    var listeners = Object.keys(shared.data.rocketio.listeners);
    if (listeners.length) {
      listeners.forEach(function(listener) {
        shared.data.rocketio.instance.removeListener(listener);
      });
    }
  };

  var functions = {
    setupRocketIOListeners: function(_this, roomId) {
      delegateRocketioListeners();

      if (shared.data.rocketio.instance) {
        shared.data.rocketio.instance.close();
      }

      var listeners = {
        newMessage: function(data) {
          data = JSON.parse(data);
          utils.formatCreatedAtTime(data);
          _this.$broadcast("app:msgView:addMessage", data);
          _this.$broadcast("app:msgView:scrollBottom");
        },

        updateRooms: function(data) {
          data = JSON.parse(data);
          _this.$broadcast("app:sidebar:updateRooms", data);
        },

        updateMembers: function(data) {
          data = JSON.parse(data);
          _this.$broadcast("app:sidebar:updateUsers", data);
        },

        userEnter: function(data) {
           // TODO Add a system message that someone got in to the room
        },

        userLeave: function(data) {
          // TODO Add a system message that someone left from the room
        }
      };

      // TODO Monitor disconnection of RocketIO caused by some errors on network
      shared.data.rocketio.instance = api.connectRocketIO(roomId);
      shared.data.rocketio.listeners = {
        newMessage: shared.data.rocketio.instance.on("newMessage", listeners.newMessage),
        updateRooms: shared.data.rocketio.instance.on("updateRooms", listeners.updateRooms),
        updateMembers: shared.data.rocketio.instance.on("updateMembers", listeners.updateMembers),
        userEnter: shared.data.rocketio.instance.on("userEnter", listeners.userEnter),
        userLeave: shared.data.rocketio.instance.on("userLeave", listeners.userLeave)
      };
    }
  };

  module.exports = functions;
})();
