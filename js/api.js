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
    checkName: resource(API_HOST + "/api/user/usable/:name")
  },

  pingRequest: function(callback) {
    this.api.ping.get({}, function(data, stat) {
      callback(data, true);
    }).error(function(data, stat) {
      callback(data, false);
    });
  },

  createNewUser: function(name, callback) {
    this.api.newUser.save({ name: name }, function(data, stat) {
      callback(data, true);
    }).error(function(data, stat) {
      callback(data, false);
    });
  },

  checkNameAvailability: function(name, callback) {
    this.api.checkName.get({ name: name }, function(data, stat) {
      callback(data, true);
    }).error(function(data, stat) {
      callback(data, false);
    });
  }
};
