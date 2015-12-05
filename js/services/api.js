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

  pingRequest: function(callback) {
    this.api.ping.get({}, function(data, stat) {
      callback(data, false);
    }).error(function(data, stat) {
      callback(data, true)
    });
  },

  createNewUser: function(name, callback) {
    this.api.newUser.post({}, function(data, stat) {
      callback(data, false);
    }).error(function(data, stat) {
      callback(data, true);
    });
  },

  checkNameAvailability: function(name, callback) {
    this.api.checkName.get({}, function(data, stat) {
      callback(data, false);
    }).error(function(data, stat) {
      callback(data, true);
    });
  }
};

