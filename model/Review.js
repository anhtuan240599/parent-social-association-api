const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  headline: String,
  body: String,
  rating: String,
  image: String,
  date: {
    type: String,
    default: getDate(),
  },
  deckID: { type: Schema.Types.ObjectId, ref: "Deck", ref: "DeckGroup" },
  deckGroupID: { type: Schema.Types.ObjectId, ref: "DeckGroup" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
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

module.exports = mongoose.model("Review", ReviewSchema);
