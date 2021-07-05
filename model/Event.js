const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EventsSchema = new Schema({
    
    title : String,
    description : String,
    start: String,
    end:String,
    image : [{
        type: Object
    }],
    cloudinaryID: {
        type: Array
    },
    date: {
        type: String,
        default: getDate(),
    },

})
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

const Events = mongoose.model('Events',EventsSchema)

module.exports = Events
