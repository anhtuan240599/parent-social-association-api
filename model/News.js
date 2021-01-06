const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsSchema = new Schema({
    
    category : String ,
    title : String,
    description : String,
    image : [{
        type: Object
    }],
    cloudinaryID: {
        type: Array
    },

})

const News = mongoose.model('News',NewsSchema)

module.exports = News
