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
    ping:      resource(API_HOST + "/api/ping"),
    newUser:   resource(API_HOST + "/api/user/new"),
    checkName: resource(API_HOST + "/api/user/usable"),

    allRooms:  resource(API_HOST + "/api/room"),
    roomEnter: resource(API_HOST + "/api/room/enter"),
    roomLeave: resource(API_HOST + "/api/room/leave")
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

  getAllRooms: function(callback) {
    var token = storage.get("token");
    this.api.allRooms.get({ token: token }).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  userRoomEnter: function(roomId, callback) {
    var token = storage.get("token");
    var params = { token: token, room_id: roomId };
    this.api.roomEnter.save(params).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  },

  userRoomLeave: function(params, callback) {
    this.api.roomLeave.delete(params).then(function(response) {
      callback(response.data, true);
    }, function(response) {
      callback(response.data, false);
    });
  }
};
