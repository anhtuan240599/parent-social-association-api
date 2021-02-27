const express = require('express')
const router = require('express-promise-router')()

const roomController = require('../controllers/room.controller')

const upload = require('../middlewares/upload-photo')

const verifyToken = require('../middlewares/verify-token')


router.route('/')
    // create room chat 
    .post(verifyToken,upload.single('image',1),roomController.createRoom)

router.route('/:roomID')
    .post(verifyToken,upload.single('image',1),roomController.addUser)

module.exports = router 