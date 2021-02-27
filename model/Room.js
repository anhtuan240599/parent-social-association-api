const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
    
    name : {type :String},
   
    users: [{ type: Schema.Types.ObjectId , ref : 'User'}],

    admin: [{ type: Schema.Types.ObjectId , ref : 'User'}],

    messages: [{ type: Schema.Types.ObjectId , ref: 'Message'}]

})

const Room = mongoose.model('Room',RoomSchema)

module.exports = Room