const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReportSchema = new Schema({

    fullName : String,
    name :String,
    image : String,
    email: String,

})

const Report = mongoose.model('Report',ReportSchema)

module.exports = Report
