const Deck = require('../model/Deck')
const User = require('../model/User')
const News = require('../model/News')
const Event = require('../model/Event')
const Review = require('../model/Review')
const cloudinary = require('../middlewares/cloudinary')
const { JWT_SECRET } = require('../config/index')
const JWT = require('jsonwebtoken')
const axios = require('axios')
const Group = require('../model/Group')
const DeckGroup = require('../model/DeckGroup')


const searchUser = async (req,res,next) => {
    if (req.query.name) {
        const regex = new RegExp(fullTextSearchVi(req.query.name), 'gi');
        const users = await User.find({ name: regex })  
        return res.status(200).json({ success: true, users:users })
    } else {
        const users = await User.find()

        return res.status(200).json({ success: true, users:users })
    }
}
const adminLogin = async (req,res,next) => {
    const foundUser = await User.findOne({ email: "admin" })
    if (!foundUser) {
        res.status(403).json({ success: false })
    } else {
        if (foundUser.comparePassword(req.body.password)) {
            let token = JWT.sign(foundUser.toJSON(), process.env.SECRET, {
                expiresIn: 6048000
            })
            res.status(200).json({ success: true, token: token })
        } else {
            res.status(403).json({ success: false })
        }
    }
}

const getNews = async (req,res,next) => {
    const news = await News.find()
    return res.status(200).json({success:true, news:news})
}
const postNews = async (req,res,next) => {
    const news = req.body
    const newsPost = new News(news)
    if (req.files) {
        const urls = []
        const ids = []
        for (const File of req.files) {
            const { path } = File
            const result = await cloudinary.uploader.upload(path);
            urls.push(result.secure_url)
            ids.push(result.public_id)

        }

        newsPost.image = urls
        newsPost.cloudinaryID = ids
    }
    await newsPost.save()
    return res.status(200).json({ success:true, news : newsPost})
}
const getEvents  = async (req,res,next) => {
    const events = await Event.find()

    return res.status(200).json({success:true , events:events})
}
const postEvent = async (req,res,next) => {
    const event = req.body
    const newEvent = new Event(event)
    if (req.files) {
        const urls = []
        const ids = []
        for (const File of req.files) {
            const { path } = File
            const result = await cloudinary.uploader.upload(path);
            urls.push(result.secure_url)
            ids.push(result.public_id)

        }

        newEvent.image = urls
        newEvent.cloudinaryID = ids
    }
    await newEvent.save()
    return res.status(200).json({ success:true, event : newEvent})
}
const getAll = async (req,res,next) => {
    const users = await User.find()
    const decks = await Deck.find()
            .populate("owner")
            .populate("reviews")
            .exec()
    return res.status(200).json({success:true , users : users , decks: decks})
}
const deleteUser = async (req,res,next) => {
    const foundUser = await User.findById(req.params.userID)
    const deck = await Deck.find()
    if (deck.like.indexOf(foundUser._id) > -1) {
        deck.like.pull(foundUser._id)
    }
    let deleteUser = await User.remove({_id: req.params.userID})
    await Deck.remove({ owner : req.params.userID })
    await DeckGroup.remove({ owner : req.params.userID })
    await Review.remove({user : req.params.userID })
    if(deleteUser)
    {
        return res.status(200).json({success:true , message : "Da xoa user"})
    }
}




module.exports = {
    deleteUser,
    adminLogin,
    getAll,
    getNews,
    getEvents,
    postNews,
    postEvent,
    searchUser
    
}

