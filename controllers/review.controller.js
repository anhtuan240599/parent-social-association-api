const Review = require('../model/Review')
const User = require('../model/User')
const Deck = require('../model/Deck')

const cloudinary = require('../middlewares/cloudinary')

const reviewDeck = async (req,res,next) => {
    const review = new Review();
    const {headline , body  } = req.body
    review.headline = headline
    review.body = body
    
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

const putReviewDeck = async(req,res,next) => {
    const review = await Review.findById(req.params.reviewID)
    if (req.body.body)
    {
        review.body = req.body.body
    }
    await review.save()
    return res.status(200).json({success: true})
}

const deleteReviewDeck = async(req,res,next) => {
    const review = await Review.findByIdAndDelete(req.params.reviewID)
    return res.status(200).json({success:true})
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
    getReviewDeck,
    putReviewDeck,
    deleteReviewDeck
}