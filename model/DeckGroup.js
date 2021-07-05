const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeckGroupSchema = new Schema({
  content: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  avatar: {
    type: String,
  },
  name: {
    type: String,
  },
  date: {
    type: String,
    default: getDate(),
  },
  image: [
    {
      type: Object,
    },
  ],
  cloudinaryID: {
    type: Array,
  },
  like: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
  return dateTime
}

const DeckGroup = mongoose.model("DeckGroup", DeckGroupSchema);

module.exports = DeckGroup;
