const express = require('express')
const userController = require('../controllers/user.controller')

const UserController = require('../controllers/user.controller')

const router = require('express-promise-router')()

const {validateParam ,validateBody, schemas} = require('../helpers/routerHelper')

router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema),UserController.newUser)

router.route('/login').post(validateBody(schemas.authLoginSchema),userController.login)

router.route('/register').post(validateBody(schemas.authRegisterSchema),userController.register)

router.route('/secret').get(userController.secret)


router.route('/:userID')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUser)
    .put(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userSchema),UserController.replaceUser)
    .patch(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userOptionalSchema),UserController.updateUser)

router.route('/:userID/decks')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUserDeck)
    .post(validateParam(schemas.idSchema,'userID'),validateBody(schemas.deckSchema),UserController.newUserDeck)


module.exports = router