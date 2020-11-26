const Review = require('../model/Review')
const User = require('../model/User')
const Deck = require('../model/Deck')

const cloudinary = require('../middlewares/cloudinary')

const reviewDeck = async (req,res,next) => {
    const review = new Review();
    const {headline , body , rating } = req.body
    review.headline = headline
    review.body = body
    review.rating = rating
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        review.image = result.secure_url
    }
    review.user = req.decoded._id
    review.deckID = req.params.deckID

    await Deck.update({ $push: review._id })

    const saveReview = await review.save()

    if( saveReview) {
        res.status(200).json({success:true})
    }
}

const getReviewDeck = async (req,res,next) => {
    const deckReviews = await Review.find({
        deckID: req.params.deckID
    })
        .populate("user")
        .exec();
        res.status(200).json({success:true , reviews : deckReviews})
}

module.exports = {
    reviewDeck,
    getReviewDeck
}