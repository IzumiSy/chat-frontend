var PRODUCTION_SERVER = 'http://chat-server-1000.herokuapp.com';
var DEVELOPMENT_SERVER = 'http://localhost:3000';

var API_HOST =
  (process.env.NODE_ENV === 'production')
    ? PRODUCTION_SERVER : DEVELOPMENT_SERVER;

module.exports = {
  api: {
    ping:      Vue.resource(API_HOST + "/api/ping"),
    newUser:   Vue.resource(API_HOST + "/api/user/new"),
    checkName: Vue.resource(API_HOST + "/api/user/usable/")
  },

  pingRequest: function() {
    this.api.ping.get({}, function(d, stat, req) {
      // Handles ping success
    }).error(function(d, stat, req) {
      // Handles ping error
    });
  },

  createNewUser: function(name) {
    this.api.newUser.post({}, function(d, stat, req) {
      // Handles HTTP request
    }).error(function(d, stat, req) {
      // Handles errors
    });
  },

  checkNameAvailability: function(name) {
    this.api.checkName.get({}, function(d, stat, req) {
      // Handles HTTP request
    }).error(function(d, stat, req) {
      // Handles errors
    });
  }
};

