const { number } = require('@hapi/joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    to : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    message: String,
    from :  {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    time : {
        type: String,
        default : getDate(),
    },
    roomID : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Room"
    }
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

module.exports = mongoose.model("Message",MessageSchema)