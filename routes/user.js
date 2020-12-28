const express = require('express')
const userController = require('../controllers/user.controller')

const router = require('express-promise-router')()

const passport = require('passport')

const upload = require('../middlewares/upload-photo')

const verifyToken = require('../middlewares/verify-token')

router.route('/')
    .get(userController.index)
    // .post(validateBody(schemas.userSchema),UserController.newUser)

router.route('/auth/facebook').post(passport.authenticate('facebook-token', {session:  false }),userController.authFacebook)

router.route('/auth/google').post(passport.authenticate('google-plus-token', {session:  false }),userController.authGoogle)

// router.route('/login').post(validateBody(schemas.authLoginSchema),passport.authenticate('local',{session: false}),userController.login)

router.route('/login').post(userController.login)

router.route('/register').post(userController.register)

router.route('/secret').get(passport.authenticate('jwt',{session : false}),userController.secret)

router.route('/year')
    .get(userController.getYear)
    .post(userController.postYear)
    
router.route('/lostPassword')
    .post(userController.lostPassword)

router.route('/user')
    .get(verifyToken,userController.foundUser)
    .put(verifyToken,upload.single('image',1),userController.replaceUser)
    .patch(verifyToken,userController.updateUser)

router.route('/:userID')
    .post(verifyToken,userController.followUser)
    .get(userController.getUser)
    // .put(validateParam(schemas.idSchema,'userID'),validateBody(schemas.userSchema),UserController.replaceUser)

router.route('/user/follows')
    .get(verifyToken,userController.getUserFollow)

router.route('/user/:deckID')
    .post(verifyToken,userController.shareDeck)

router.route('/user/decks')
    .get(verifyToken,userController.getUserDeck)
    .post(userController.newUserDeck)

router.route('/user/years')
    .get(verifyToken,userController.getUserYear)



module.exports = router