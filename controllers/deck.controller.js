const User = require('../model/User')
const Deck = require('../model/Deck')
const Joi = require('@hapi/joi')



const index = async (req,res,next) => {
    const decks = await Deck.find({})

    return res.status(200).json({decks})
}

const newDeck = async (req,res,next) => {
   
    const owner = await User.findById(req.body.owner)

    const deck = req.value.body
    delete deck.owner

    deck.owner = owner._id
    const newDeck = new Deck(deck)
    await newDeck.save()

    owner.decks.push(newDeck._id)
    await owner.save()

    return res.status(201).json({deck :newDeck})
  
}





module.exports = {
    index,
    newDeck,
    
}