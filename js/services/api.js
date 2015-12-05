var PRODUCTION_SERVER = 'http://chat-server-1000.herokuapp.com';
var API_HOST = (process.env.NODE_ENV === 'production') ? PRODUCTION_SERVER : 'localhost';

module.exports = {
  pingRequest: function() {
    this.$http.get(API_HOST + "/api/ping", function(d, stat, req) {
      // Handles ping success
    }).error(function(d, stat, req) {
      // Handles ping error
    });
  },

  createNewUser: function(name) {
    this.$http.post(API_HOST + "/api/user/new", function(d, stat, req) {
      // Handles HTTP request
    }).error(function(d, stat, req) {
      // Handles errors
    });
  },

  checkNameAvailability: function(name) {
    this.$http.get(API_HOST + "/api/user/usable/" + name, function(d, stat, req) {
      // Handles HTTP request
    }).error(function(d, stat, req) {
      // Handles errors
    });
  }
};

