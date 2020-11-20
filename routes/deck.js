const express = require('express')
const upload_photo = require('../middlewares/upload-photo')

const DeckController = require('../controllers/deck.controller')

const router = require('express-promise-router')()

const {validateParam ,validateBody, schemas} = require('../helpers/routerHelper')

router.route('/')
    .get(DeckController.index)
    .post(upload_photo.single('image',1),DeckController.newDeck)

router.route('/:deckID')
    .get(validateParam(schemas.idSchema,'deckID'),DeckController.getDeck)
    .put(validateParam(schemas.idSchema,'deckID'),validateBody(schemas.newDeckSchema), DeckController.replaceDeck)
    .patch(validateParam(schemas.idSchema,'deckID'),validateBody(schemas.deckOptionalSchema), DeckController.updateDeck)
    .delete(validateParam(schemas.idSchema,'deckID'),DeckController.deleteDeck)


module.exports = router 