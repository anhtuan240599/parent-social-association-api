const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  category: String,
  title: String,
  description: String,
  image: [
    {
      type: Object,
    },
  ],
  cloudinaryID: {
    type: Array,
  },
  date: {
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
const News = mongoose.model("News", NewsSchema);

module.exports = News;
