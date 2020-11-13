const User = require('../model/User')
const Deck = require('../model/Deck')
const Joi = require('@hapi/joi')
const { JWT_SECRET } = require('../config/index')
const JWT = require('jsonwebtoken')

const authFacebook = async(req,res,next) => {
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization',token)

    return res.status(200).json({ success:true})
}

const authGoogle = async (req,res,next) => {
    
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization',token)

    return res.status(200).json({ success:true})
}

const encodedToken = (userID) => {
    return JWT.sign({ 
        iss:'Tuan Huynh',
        sub: userID,
        iat : new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)

    },JWT_SECRET)
}

const idSchema = Joi.object().keys({
    userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const getUser = async (req,res,next) => {
    
    const {userID} = req.value.params
    const user = await User.findById(userID)
    console.log(user)
    return res.status(200).json({user})

}

const getUserDeck = async (req,res,next) => {

    const {userID} = req.value.params
    const user = await User.findById(userID).populate('decks')
    return res.status(200).json({decks : user.decks})

}

const index = async (req,res,next) => {
    
    const users = await User.find({})
    return res.status(200).json({users})
}

const newUser = async (req,res,next) => {
   
    const newUser = new User(req.value.body)
    await newUser.save()
    return res.status(201).json({user : newUser})
  
}

const newUserDeck = async (req,res,next) => {

    const {userID} = req.value.params 

    const newDeck = new Deck(req.value.body)

    const user = await User.findById(userID)

    newDeck.owner = user

    newDeck.save()

    user.decks.push(newDeck._id)

    await user.save()

    res.status(201).json({deck:newDeck})
}

const replaceUser = async (req,res,next) => {

    const {userID} = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({success : true})
}

const secret = async (req,res,next) => {
    return res.status(200).json({ success: true })
}

const login = async (req,res,next) => {
    const token = encodedToken(req.user._id)

    res.setHeader('Authorization',token)

    return res.status(200).json({ success:true})
}

const register = async (req,res,next) => {
    const {firstName,lastName,email,password} = req.value.body
    
    const foundUser = await User.findOne({email})
    if (foundUser) return res.status(403).json({error : {message : 'Email is already in use'}})

    const newUser = new User({firstName,lastName,email,password})

    newUser.save()

    //Encode token
    const token = encodedToken(newUser._id)

    res.setHeader('Authorization',token)

    return res.status(200).json({success : true})
}

const updateUser = async (req,res,next) => {

    const {userID} = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({success : true})

}

module.exports = {
    index,
    newUser,
    getUser,
    replaceUser,
    updateUser,
    getUserDeck,
    newUserDeck,
    login,
    register,
    secret,
    authGoogle,
    authFacebook
}