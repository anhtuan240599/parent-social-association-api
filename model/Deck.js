const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeckSchema = new Schema({
    name : { type :String},

    description : {type:String},
    content: {type:String},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        default: getDate(),
    },
    image: [{
        type: Object
    }],
    cloudinaryID: {
        type: Array
    },
    rating: {
        type: false
    },
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isCompleted : { type: false }
    
    
})

function getDate() {
    var d = new Date();
    var fullTime = `${getFormatTime()}  ${getFormatDate()} `;
    return fullTime.toString();

    function getFormatTime(){
        var hours = d.getHours().toString();
        hours = hours.length > 1 ? hours : '0' + hours;

        var minutes = d.getMinutes().toString();
        minutes = minutes.length > 1 ? minutes : '0' + minutes;
        return hours + ':' + minutes;
    }
    function getFormatDate() {
        var year = d.getFullYear();

        var month = (1 + d.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = d.getDate().toString();
        day = day.length > 1 ? day : '0' + day;

        return day + '/' + month + '/' + year;
    }
}

const Deck = mongoose.model('Deck',DeckSchema)

module.exports = Deck
