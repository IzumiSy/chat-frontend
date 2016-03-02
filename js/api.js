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

      userSelf:  resource(API_HOST + "/api/user"),
      newUser:   resource(API_HOST + "/api/user/new"),
      getUser:   resource(API_HOST + "/api/user/:id"),
      patchUser: resource(API_HOST + "/api/user/:id"),

      allRooms:  resource(API_HOST + "/api/room"),
      getUsers:  resource(API_HOST + "/api/room/:id/users"),
      roomEnter: resource(API_HOST + "/api/room/:id/enter"),
      roomLeave: resource(API_HOST + "/api/room/:id/leave"),

      sendMessage: resource(API_HOST + "/api/message/:id")
    },

    pingRequest: function() {
      return this.api.ping.get();
    },

    createNewUser: function(name) {
      return this.api.newUser.save({ name: name });
    },

    getSelfData: function() {
      var token = storage.get("token");
      return this.api.userSelf.get({ token: token });
    },

    patchUser: function(userId, data) {
      var token = storage.get("token");
      return this.api.patchUser.patch({ id: userId, data: data, token: token });
    },

    getAllRooms: function() {
      var token = storage.get("token");
      return this.api.allRooms.get({ token: token });
    },

    getRoomUsers: function(roomId) {
      var token = storage.get("token");
      return this.api.getUsers.get({ id: roomId }, { token: token });
    },

    userRoomEnter: function(roomId) {
      var token = storage.get("token");
      return this.api.roomEnter.save({ id: roomId }, { token: token });
    },

    userRoomLeave: function(roomId) {
      var token = storage.get("token");
      return this.api.roomLeave.save({ id: roomId }, { token: token });
    },

    sendMessage: function(roomId, message) {
      var token = storage.get("token");
      var params = { content: message, token: token };
      return this.api.sendMessage.save({ id: roomId }, params);
    },

    connectRocketIO: function(roomId) {
      return (new RocketIO({ channel: roomId })).connect(API_HOST);
    }
  };
})();
