const express = require('express')

const DeckController = require('../controllers/deck.controller')

const router = require('express-promise-router')()

const {validateParam ,validateBody, schemas} = require('../helpers/routerHelper')

router.route('/')
    .get(DeckController.index)
    .post(validateBody(schemas.newDeckSchema),DeckController.newDeck)



module.exports = router 