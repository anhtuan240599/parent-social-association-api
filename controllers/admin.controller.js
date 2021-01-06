const Deck = require('../model/Deck')
const User = require('../model/User')
const News = require('../model/News')
const cloudinary = require('../middlewares/cloudinary')
const { JWT_SECRET } = require('../config/index')
const JWT = require('jsonwebtoken')
const axios = require('axios')

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
const getAll = async (req,res,next) => {
    const users = await User.find()
    const decks = await Deck.find()
            .populate("owner")
            .populate("reviews")
            .exec()
    return res.status(200).json({success:true , users : users , decks: decks})
}
const deleteUser = async (req,res,next) => {
    let deleteUser = await User.remove({_id: req.params.userID})
    if(deleteUser)
    {
        return res.status(200).json({success:true , message : "Da xoa user"})
    }
}




module.exports = {
    deleteUser,
    adminLogin,
    getAll,
    postNews
}

