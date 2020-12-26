const express = require('express')
const router = require('express-promise-router')()
const upload = require('../middlewares/upload-photo')

const DeckController = require('../controllers/deck.controller')

const verifyToken = require('../middlewares/verify-token')
const { get } = require('mongoose')


router.route('/')
    .get(DeckController.index)
    .post(verifyToken,upload.array('image',20),DeckController.newDeck)

router.route('/user')
    .get(verifyToken,DeckController.getUserDeck)

router.route('/:deckID')
    .post(verifyToken,DeckController.likeDeck)
    .get(DeckController.getDeck)
    .put( DeckController.replaceDeck)
    .patch(verifyToken,upload.array('image',20), DeckController.updateDeck)
    .delete(DeckController.deleteDeck)


module.exports = router 