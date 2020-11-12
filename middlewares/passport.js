const passport = require('passport')
const passport_local = require('passport-local')
const jwt_passport = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const { JWT_SECRET } = require('../config')

const User = require('../model/User')

passport.use( new jwt_passport({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        const user = await User.findById(payload.sub)

        if(!user) return done(null,false)

        done(null,user)
        
    } catch (error) {
        done(error, false)
    }
}))


passport.use(new passport_local({
    usernameField: 'email'
}, async (email,password,done) => {
    try{
    const user = await User.findOne({email})
    
    if (!user) return done(null,false)

    const isCorrectPassword = await user.isValidPassword(password)

    if(!isCorrectPassword) return done(null,false)
    
    done(null,user) 
    } catch (error) {
        done(error, false)
    }
}))