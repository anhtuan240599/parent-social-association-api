const express = require('express')
const userController = require('../controllers/user.controller')

const UserController = require('../controllers/user.controller')

const router = require('express-promise-router')()

const {validateParam ,validateBody, schemas} = require('../helpers/routerHelper')

const passport = require('passport')

const passportConfig = require('../middlewares/passport')

const { session } = require('passport')

const verifyToken = require('../middlewares/verify-token')

router.route('/')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema),UserController.newUser)

router.route('/auth/facebook').post(passport.authenticate('facebook-token', {session:  false }),userController.authFacebook)

router.route('/auth/google').post(passport.authenticate('google-plus-token', {session:  false }),userController.authGoogle)

// router.route('/login').post(validateBody(schemas.authLoginSchema),passport.authenticate('local',{session: false}),userController.login)

router.route('/login').post(userController.login)

router.route('/register').post(validateBody(schemas.authRegisterSchema),userController.register)

router.route('/secret').get(passport.authenticate('jwt',{session : false}),userController.secret)

router.route('/user')
    .get(verifyToken,userController.foundUser)
    .put(verifyToken,UserController.replaceUser)

router.route('/:userID')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUser)
    // .put(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userSchema),UserController.replaceUser)
    .patch(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userOptionalSchema),UserController.updateUser)

router.route('/:userID/decks')
    .get(validateParam(schemas.idSchema,'userID'),UserController.getUserDeck)
    .post(validateParam(schemas.idSchema,'userID'),validateBody(schemas.deckSchema),UserController.newUserDeck)


module.exports = router