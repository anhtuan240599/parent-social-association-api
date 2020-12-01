const User = require('../model/User')
const Deck = require('../model/Deck')
const Joi = require('@hapi/joi')
const cloudinary = require('../middlewares/cloudinary')
const upload = require('../middlewares/upload-photo')


const getDeck = async (req,res,next) => {
    const deck = await Deck.findById(req.value.params.deckID)
        .populate("owner")
        .populate("reviews")
        .exec()

    return res.status(200).json({deck})
}

const index = async (req,res,next) => {
    const decks = await Deck.find()
        .populate("owner")
        .populate("reviews")
        .exec()

    return res.status(200).json({success:true,decks:decks})
}

const newDeck = async (req,res,next) => {
   
    const owner = await User.findById(req.body.owner)

    const deck = req.body
    
    delete deck.owner

    deck.owner = owner._id
    const newDeck = new Deck(deck)

    // if(req.files)
    // {
    //     const urls = []
    //     const ids = []
    //     for (const file of req.files) {
    //         const {path} = file
    //         const result = await cloudinary.uploader.upload(path);
    //         urls.push(result.secure_url)
    //         ids.push(result.public_id)
            
    //     }
        
    //     newDeck.image = urls
    //     newDeck.cloudinaryID = ids
    // } 
    if(req.files)
    {
        const urls = []
        const ids = []
        for (const File of req.files) {
            const {path} = File
            const result = await cloudinary.uploader.upload(path);
            urls.push(result.secure_url)
            ids.push(result.public_id)
            
        }
        
        newDeck.image = urls
        newDeck.cloudinaryID = ids
    } 
    
    await newDeck.save()

    owner.decks.push(newDeck._id)
    await owner.save()

    return res.status(201).json({deck :newDeck})
  
}
const replaceDeck = async (req,res,next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    return res.status(200).json({success : true})
}
const updateDeck = async (req,res,next) => {
    const { deckID } = req.value.params
    const newDeck = req.value.body
    const result = await Deck.findByIdAndUpdate(deckID, newDeck)
    return res.status(200).json({success : true})

}
const deleteDeck = async (req,res,next) => {
    const { deckID } = req.value.params

    const deck = await Deck.findById(deckID)
    const ownerID = deck.owner

    const owner = await User.findById(ownerID)

    await deck.remove()

    owner.decks.pull(deck)
    await owner.save()

    return res.status(200).json({ success : true })
}




module.exports = {
    index,
    newDeck,
    getDeck,
    replaceDeck,
    updateDeck,
    deleteDeck
}