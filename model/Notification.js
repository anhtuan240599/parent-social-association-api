const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title: {
    require: true,
    type: String,
  },
  creator: {
    type: String,
  },
  created_at: {
    type: String,
    default: getDate(),
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

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
