const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeacherSchema = new Schema({
    
    teacherID: {
        type: String
    },
    userName: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    tag: {
        type: String
    },
    formTeacher: {
        type: String
    },
    Dean: {
        type: false
    }


})

const Teacher = mongoose.model('Teacher',TeacherSchema)

module.exports = Teacher