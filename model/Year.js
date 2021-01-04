const mongoose = require('mongoose')
const Schema = mongoose.Schema

const YearSchema = new Schema({
    
    schoolYear: String,

    users: [{ type: Schema.Types.ObjectId , ref : 'User'}],

    decks: [{ type: Schema.Types.ObjectId , ref : 'DeckGroup'}]

})

const Year = mongoose.model('Year',YearSchema)

module.exports = Year
