var PRODUCTION_SERVER = 'http://chat-server-1000.herokuapp.com';
var API_HOST = (process.env.NODE_ENV === 'production') ? PRODUCTION_SERVER : 'localhost';

module.exports = {
  createNewUser: function(name) {
    this.$http.post("/api/user/new", function(d, stat, req) {
      // Handles HTTP request
    }).error(function(d, stat, req) {
      // Handles errors
    });
  },

  checkNameAvailability: function(name) {
    this.$http.get("/api/user/usable/" + name, function(d, stat, req) {
      // Handles HTTP request
    }).error(function(d, stat, req) {
      // Handles errors
    });
  }
};

