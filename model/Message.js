const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    to : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    message: String,
    abc: String,
    from :  {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

module.exports = mongoose.model("Message",MessageSchema)