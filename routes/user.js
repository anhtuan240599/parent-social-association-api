const express = require('express')

const UserController = require('../controllers/user.controller')

const router = require('express-promise-router')()

const {validateParam , schemas} = require('../helpers/routerHelper')

router.route('/')
    .get(UserController.index)
    .post(UserController.newUser)

router.route('/:userID')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUser)
    .put(UserController.replaceUser)
    .patch(UserController.updateUser)

router.route('/:userID/decks')
    .get(UserController.getUserDeck)
    .post(UserController.newUserDeck)


module.exports = router