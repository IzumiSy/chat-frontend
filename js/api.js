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
    this.api.newUser.save({ name: name }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  checkNameAvailability: function(name, callback) {
    this.api.checkName.save({ name: name }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  getSelfData: function(callback) {
    var token = storage.get("token");
    this.api.userSelf.get({ token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  getAllRooms: function(callback) {
    var token = storage.get("token");
    this.api.allRooms.get({ token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  getRoomUsers: function(roomId, callback) {
    var token = storage.get("token");
    this.api.getUsers.get({ id: roomId }, { token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  getRoomMessages: function(roomId, callback) {
    var token = storage.get("token");
    this.api.getMsgs.get({ id: roomId }, { token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  userRoomEnter: function(roomId, callback) {
    var token = storage.get("token");
    this.api.roomEnter.save({ id: roomId }, { token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  userRoomLeave: function(roomId, callback) {
    var token = storage.get("token");
    this.api.roomLeave.save({ id: roomId }, { token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  sendMessage: function(roomId, callback) {
    var token = storage.get("token");
    this.api.sendMessage.save({ id: roomId }, { token: token }).then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
  },

  connectRocketIO: function(roomId) {
    var token = storage.get("token");
    var params = { roomId: roomId, token: token };
    return (new RocketIO(params)).connect(API_HOST);
  }
};
