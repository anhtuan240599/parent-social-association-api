const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const { string } = require('@hapi/joi')
const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type : String,
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
    decks: [{
        type: Schema.Types.ObjectId,
        ref : 'Deck'
    }],
    
})

UserSchema.methods.isValidPassword = async function(newPassword) {
    try{
        console.log(newPassword,this.password)
        return await bcrypt.compare(newPassword, this.password)
       
    } catch (error) {
        throw new Error(error)
    }
}

UserSchema.pre('save', async function (next) {
    try {
        if(this.authType !== 'local') next()
        
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
