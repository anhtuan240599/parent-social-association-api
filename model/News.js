const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NewsSchema = new Schema({

    category: String,
    title: String,
    description: String,
    image: [{
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
    var d = new Date();
    var fullTime = `${getFormatTime()}  ${getFormatDate()} `;
    return fullTime.toString();

    function getFormatTime() {
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

const News = mongoose.model('News', NewsSchema)

module.exports = News