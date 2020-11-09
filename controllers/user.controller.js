const User = require('../model/User')
const Deck = require('../model/Deck')
const Joi = require('@hapi/joi')

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
    newUserDeck
}