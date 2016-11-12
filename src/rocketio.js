import shared from "./shared.js";
import api from "./api.js";
import utils from "./utils.js";

const delegateRocketioListeners = function() {
  if (!shared.data.rocketio.instance) {
    return;
  }

  const listeners = Object.keys(shared.data.rocketio.listeners);
  if (listeners.length) {
    listeners.forEach(function(listener) {
      shared.data.rocketio.instance.removeListener(listener);
    });
  }
};

export default {
  setupRocketIOListeners(_this, roomId) {
    delegateRocketioListeners();

    if (shared.data.rocketio.instance) {
      shared.data.rocketio.instance.close();
      console.info("[ROCKET.IO] Closed.");
    }

    const listeners = {
      connected() {
        _this.$broadcast("app:msgInput:networkConnected");
        _this.$broadcast("app:sidebar:networkConnected");
        console.info("[ROCKET.IO] Connected.");
      },

      error() {
        // TODO now network error handling is disabled here because Heroku will send
        // "idle connection" as an error so here unhopefully catches them. This error
        // catching block has to handle them not as an error in the future.
        // _this.$broadcast("app:msgInput:networkError");
        // _this.$broadcast("app:sidebar:networkError");
      },

      newMessage(data) {
        _data = JSON.parse(data);
        utils.formatCreatedAtTime(_data);
        _this.$broadcast("app:msgView:addMessage", _data);
        _this.$broadcast("app:msgView:scrollBottom");
      },

      updateRooms(data) {
        _data = JSON.parse(data);
        _this.$broadcast("app:sidebar:updateRooms", _data);
      },

      updateMembers(data) {
        _data = JSON.parse(data);
        _this.$broadcast("app:sidebar:updateUsers", _data);
      },

      userEnter(data) {
         // TODO Add a system message that someone got in to the room
      },

      userLeave(data) {
        // TODO Add a system message that someone left from the room
      }
    };

    // TODO Monitor disconnection of RocketIO caused by some errors on network
    const rocketio = shared.data.rocketio.instance = api.connectRocketIO(roomId);
    shared.data.rocketio.listeners = {
      newMessage:    rocketio.on("newMessage", listeners.newMessage),
      updateRooms:   rocketio.on("updateRooms", listeners.updateRooms),
      updateMembers: rocketio.on("updateMembers", listeners.updateMembers),
      userEnter:     rocketio.on("userEnter", listeners.userEnter),
      userLeave:     rocketio.on("userLeave", listeners.userLeave),
      connected:     rocketio.on("connect", listeners.connected),
      error:         rocketio.on("error", listeners.error)
    };
  }
};
