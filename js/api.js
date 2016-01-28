(function() {
  'use strict';

  var storage = require("./storage.js");

  var PRODUCTION_SERVER = 'http://chat-server-1000.herokuapp.com';
  var DEVELOPMENT_SERVER = 'http://localhost:3000';

  var API_HOST =
    (process.env.NODE_ENV === 'production') ?
      PRODUCTION_SERVER : DEVELOPMENT_SERVER;

  // Option argument of Vue.resource(...) should have emulateJSON
  // it can prevent sending pre-flight request when accessing to
  // the backend server to call API.
  var resource = function(url) {
    var options = {
      emulateJSON: true
    };
    return Vue.resource(url, null, null, options);
  };

  module.exports = {
    api: {
      ping: resource(API_HOST + "/api/ping"),

      newUser:   resource(API_HOST + "/api/user/new"),
      checkName: resource(API_HOST + "/api/user/usable"),
      userSelf:  resource(API_HOST + "/api/user"),
      getUser:   resource(API_HOST + "/api/user/:id"),

      allRooms:  resource(API_HOST + "/api/room"),
      getMsgs:   resource(API_HOST + "/api/room/:id/messages"),
      getUsers:  resource(API_HOST + "/api/room/:id/users"),
      roomEnter: resource(API_HOST + "/api/room/:id/enter"),
      roomLeave: resource(API_HOST + "/api/room/:id/leave"),

      sendMessage: resource(API_HOST + "/api/message/:id")
    },

    pingRequest: function(callback) {
      this.api.ping.get().then(function(response) {
        callback(response.data, true);
      }, function(response) {
        callback(response.data, false);
      });
    },

    createNewUser: function(name, callback) {
      return this.api.newUser.save({ name: name });
    },

    checkNameAvailability: function(name, callback) {
      return this.api.checkName.save({ name: name });
    },

    getSelfData: function(callback) {
      var token = storage.get("token");
      this.api.userSelf.get({ token: token }).then(function(response) {
        callback(response.data, true);
      }, function(response) {
        callback(response.data, false);
      });
    },

    getAllRooms: function() {
      var token = storage.get("token");
      return this.api.allRooms.get({ token: token });
    },

    getRoomUsers: function(roomId) {
      var token = storage.get("token");
      return this.api.getUsers.get({ id: roomId }, { token: token });
    },

    getRoomMessages: function(roomId) {
      var token = storage.get("token");
      return this.api.getMsgs.get({ id: roomId }, { token: token });
    },

    userRoomEnter: function(roomId, callback) {
      var token = storage.get("token");
      return this.api.roomEnter.save({ id: roomId }, { token: token });
    },

    userRoomLeave: function(roomId, callback) {
      var token = storage.get("token");
      return this.api.roomLeave.save({ id: roomId }, { token: token });
    },

    sendMessage: function(roomId, message, callback) {
      var token = storage.get("token");
      var params = { content: message, token: token };
      this.api.sendMessage.save({ id: roomId }, params).then(function(response) {
        callback(response.data, true);
      }, function(response) {
        callback(response.data, false);
      });
    },

    connectRocketIO: function(roomId) {
      return (new RocketIO({ channel: roomId })).connect(API_HOST);
    }
  };
})();
