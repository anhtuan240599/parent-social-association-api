const express = require('express')
const router = require('express-promise-router')()
const upload = require('../middlewares/upload-photo')

const DeckController = require('../controllers/deck.controller')



const {validateParam ,validateBody, schemas} = require('../helpers/routerHelper')

router.route('/')
    .get(DeckController.index)
    .post(upload.array('image',20),DeckController.newDeck)

router.route('/:deckID')
    .get(validateParam(schemas.idSchema,'deckID'),DeckController.getDeck)
    .put(validateParam(schemas.idSchema,'deckID'),validateBody(schemas.newDeckSchema), DeckController.replaceDeck)
    .patch(validateParam(schemas.idSchema,'deckID'),validateBody(schemas.deckOptionalSchema), DeckController.updateDeck)
    .delete(validateParam(schemas.idSchema,'deckID'),DeckController.deleteDeck)


module.exports = router 