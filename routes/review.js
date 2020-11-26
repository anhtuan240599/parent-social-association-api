const express = require('express')
const router = require('express-promise-router')()

const ReviewController = require('../controllers/review.controller')

const upload = require('../middlewares/upload-photo')

const verifyToken = require('../middlewares/verify-token')

router.route('/:deckID')
    .get(ReviewController.getReviewDeck)
    .post(verifyToken,upload.single('image',1),ReviewController.reviewDeck)


module.exports = router