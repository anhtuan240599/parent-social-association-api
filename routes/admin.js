const express = require('express')
const router = require('express-promise-router')()
const upload = require('../middlewares/upload-photo')
const uploadFileMW = require('../middlewares/upload-file')

const adminController = require('../controllers/admin.controller')

const verifyToken = require('../middlewares/verify-token')


router.route('/report')
    .post(upload.single('image',1),adminController.reportUser)
    .get(verifyToken,adminController.getReport)

router.route('/reply')
    .post(verifyToken,adminController.reply)

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

router.route('/addUsers')
    .post(verifyToken,uploadFileMW().single('file'),adminController.addListUser)

module.exports = router 