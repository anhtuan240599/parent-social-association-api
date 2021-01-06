const express = require('express')
const router = require('express-promise-router')()
const upload = require('../middlewares/upload-photo')

const adminController = require('../controllers/admin.controller')

const verifyToken = require('../middlewares/verify-token')


router.route('/:userID')
    .delete(verifyToken,adminController.deleteUser)

router.route('/users')
    .get(verifyToken,adminController.getAll)
    .post(verifyToken,adminController.searchUser)

router.route('/news')
    .post(verifyToken,upload.array('image',20),adminController.postNews)
    .get(verifyToken,adminController.getNews)

router.route('/event')
    .post(verifyToken,upload.array('image',20),adminController.postEvent)
    .get(verifyToken,adminController.getEvents)

router.route('/login')
    .post(verifyToken,adminController.adminLogin)

module.exports = router 