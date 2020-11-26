const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    headline: String,
    body: String,
    rating: String,
    image: String,
    deckID: { type: Schema.Types.ObjectId, ref:"Deck"},
    user: { type:Schema.Types.ObjectId, ref:"User"}
})

module.exports = mongoose.model("Review",ReviewSchema)