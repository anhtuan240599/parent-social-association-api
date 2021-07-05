const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
  name: { type: String },

  description: { type: String },
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
  rating: {
    type: false,
  },
  like: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isCompleted: { type: false },
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

const Deck = mongoose.model("Deck", DeckSchema);

module.exports = Deck;
