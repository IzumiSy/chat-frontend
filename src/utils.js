import storage from "./storage.js";

export default {
  checkLogin() {
    if (storage.get("token")) {
      return true;
    } else {
      return false;
    }
  },

  attrFaceAsset(face) {
    return ("assets/faces/" + face + ".png");
  },

  formatCreatedAtTime(messageData) {
    const date = new Date(messageData.created_at);
    messageData.formatted_created_at_time =
      (date.getHours() + ":" + date.getMinutes());
    return messageData;
  }
};
