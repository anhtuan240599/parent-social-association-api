const express = require('express')
const router = require('express-promise-router')()
const upload = require('../middlewares/upload-photo')

const Group = require('../controllers/group.controller')

const verifyToken = require('../middlewares/verify-token')


router.route('/:groupID')
    .post(verifyToken,upload.array('image',20),Group.newDeckGroup)
    .get(verifyToken,Group.getDeckGroup)

module.exports = router 