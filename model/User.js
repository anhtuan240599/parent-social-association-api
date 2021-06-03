const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const { string, object } = require('@hapi/joi')
const UserSchema = new Schema({
    userName: {
        type: String
    },
    studentID: {
        type: String,
    },
    class: {
        type:String,
    },
    nameChild: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    avatar:{
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type : String,
    },
    following:[{
        type: Schema.Types.ObjectId
    }],
    followers:[{
        type: Schema.Types.ObjectId
    }],
    yearID:{
        type: Schema.Types.ObjectId,
        ref: "Year"
    },
    deckShare: [{
        type: Schema.Types.ObjectId,
        ref:   "Deck"
    }],
    role: {
        type:String
    },
    phone:{
        type: String
    },
    gender: {
        type: String
    },
    background:{
        type: String
    },
    authGoogleID: {
        type:String,
        default:null
    },
    authFacebookID: {
        type:String,
        default:null
    },
    authType: {
        type:String,
        enum: ['local','google','facebook'],
        default: 'local'
    },
    decksGroup: [{
        type: Schema.Types.ObjectId,
        ref : 'DeckGroup'
    }],
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group',
    }],
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Room',
    }],
    decks: [{
        type: Schema.Types.ObjectId,
        ref : 'Deck'
    }],
    address: { type: Schema.Types.ObjectId, ref:"Address" },
    createdAt: {
        type: Date
    }
    
})

UserSchema.methods.isValidPassword = async function(newPassword) {
    try{
        console.log(newPassword,this.password)
        return await bcrypt.compare(newPassword, this.password)
       
    } catch (error) {
        throw new Error(error)
    }
}

UserSchema.methods.comparePassword = function (password,next) {
    let user = this;
    return bcrypt.compareSync(password, user.password)
    
}

UserSchema.pre('save', async function (next) {
    try {
        if(this.authType !== 'local') next()

        if(this.password.length > 50) next()
        
        const salt = await bcrypt.genSalt(10)

        const passwordHashed = await bcrypt.hash(this.password, salt)

        this.password = passwordHashed

        next()
    } catch (error) {
        next(error)
    }
    
})

const User = mongoose.model('User',UserSchema)

module.exports = User
