const passport = require('passport')
const passport_local = require('passport-local')
const jwt_passport = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const { JWT_SECRET } = require('../config')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')

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

//Passport google
passport.use( new GooglePlusTokenStrategy({
   clientID: '103010080724-je5sgdc5314j1f1atn2r3r5e7luqr606.apps.googleusercontent.com',
   clientSecret: 'i_0L6aIjD3fPA2bbf0Z-sPRg'
}, async ( accessToken, refreshToken, profile ,done) => {
    try{
        console.log('accessToken', accessToken)
        console.log('refreshToken',refreshToken)
        console.log('profile',profile)
        // check current user in db
        const user = await User.findOne({
            authGoogleID : profile.id,
            authType: "google",
        })
        if(user) return done(null,user)
        // if new account
        const newUser = new User({
            authType: 'google',
            authGoogleID : profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName : profile.name.familyName
        })

        await newUser.save()

        done(null, newUser)
    } catch (error) {
        done(error, false)
    }
}))

//FB passport
passport.use( new FacebookTokenStrategy({
    clientID: '893618984376188',
    clientSecret: '0f90ad4ab708dbeefc0db227d6d56a60'
 }, async ( accessToken, refreshToken, profile ,done) => {
     try{
         console.log('accessToken', accessToken)
         console.log('refreshToken',refreshToken)
         console.log('profile',profile)
         // check current user in db
         const user = await User.findOne({
             authFacebookID : profile.id,
             authType: "facebook",
         })
         if(user) return done(null,user)
         // if new account
         const newUser = new User({
              authType: 'facebook',
              authGoogleID : profile.id,
              email: profile.emails[0].value,
              firstName: profile.name.givenName,
              lastName : profile.name.familyName
         })
 
         await newUser.save()
 
         done(null, newUser)
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