const express = require('express')

const UserController = require('../controllers/user.controller')

const router = require('express-promise-router')()

const {validateParam ,validateBody, schemas} = require('../helpers/routerHelper')

router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema),UserController.newUser)

router.route('/:userID')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUser)
    .put(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userSchema),UserController.replaceUser)
    .patch(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userOptionalSchema),UserController.updateUser)

router.route('/:userID/decks')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUserDeck)
    .post(validateParam(schemas.idSchema,'userID'),validateBody(schemas.deckSchema),UserController.newUserDeck)


module.exports = router