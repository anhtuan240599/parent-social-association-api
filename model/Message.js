const { number, object } = require("@hapi/joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: String,
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  time: {
    type: String,
    default: getDate(),
  },
  image: [
    {
      type: Object,
    },
  ],
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});
function getDate() {
  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  if (today.getMinutes() < 10) {
    var time = today.getHours() + ":0" + today.getMinutes();
  } else {
    var time = today.getHours() + ":" + today.getMinutes();
  }
  var dateTime = time + " " + date;
  return dateTime;
}

module.exports = mongoose.model("Message", MessageSchema);
