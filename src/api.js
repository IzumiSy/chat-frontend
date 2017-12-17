import RocketIO from 'rocket.io/rocketio.js';
import storage from './storage.js';
import VueResource from 'vue-resource';

const API_HOST = process.env.apiServerUrl;

Vue.use(VueResource);

// Option argument of Vue.resource(...) should have emulateJSON
// it can prevent sending pre-flight request when accessing to
// the backend server to call API.
const resource = function(url) {
  return Vue.resource(url, null, null, { emulateJSON: true });
};

const setTokenHeader = function(token) {
  Vue.http.headers.common.Authorization = ("Basic " + token);
};

export default {
  api: {
    ping: resource(API_HOST + "/healthcheck"),

    isNameDup: resource(API_HOST + "/api/user/duplicate/:name"),
    newUser:   resource(API_HOST + "/api/user/new"),
    getUser:   resource(API_HOST + "/api/user/:id"),
    patchUser: resource(API_HOST + "/api/user/:id"),

    allRooms:  resource(API_HOST + "/api/room"),
    getUsers:  resource(API_HOST + "/api/room/:id/users"),
    roomEnter: resource(API_HOST + "/api/room/:id/enter"),
    roomLeave: resource(API_HOST + "/api/room/:id/leave"),

    sendMessage: resource(API_HOST + "/api/message/:id")
  },

  pingRequest() {
    return this.api.ping.get();
  },

  isNameDuplicated(name) {
    setTokenHeader(storage.get("token"));
    return this.api.isNameDup.get({ name: name });
  },

  createNewUser(name, face) {
    setTokenHeader(storage.get("token"));
    return this.api.newUser.save({ name: name, face: face });
  },

  patchUser(userId, data) {
    setTokenHeader(storage.get("token"));
    return this.api.patchUser.save({ id: userId }, { data: data });
  },

  getAllRooms() {
    setTokenHeader(storage.get("token"));
    return this.api.allRooms.get();
  },

  getRoomUsers(roomId) {
    setTokenHeader(storage.get("token"));
    return this.api.getUsers.get({ id: roomId });
  },

  userRoomEnter(roomId) {
    setTokenHeader(storage.get("token"));
    return this.api.roomEnter.save({ id: roomId }, {});
  },

  userRoomLeave(roomId) {
    setTokenHeader(storage.get("token"));
    return this.api.roomLeave.save({ id: roomId }, {});
  },

  sendMessage(roomId, message) {
    var params = { content: message };
    setTokenHeader(storage.get("token"));
    return this.api.sendMessage.save({ id: roomId }, params);
  },

  connectRocketIO(roomId) {
    return (new RocketIO({
      type: "comet",
      channel: roomId,
      ssl: (process.env.NODE_ENV === 'production' ? true : false)
    })).connect(API_HOST);
  }
};
