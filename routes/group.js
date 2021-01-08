const express = require('express')
const router = require('express-promise-router')()
const upload = require('../middlewares/upload-photo')

const Group = require('../controllers/group.controller')

const verifyToken = require('../middlewares/verify-token')


router.route('/decks/:groupID')
    .post(verifyToken,upload.array('image',20),Group.newDeckGroup)
    .get(verifyToken,Group.getDeckGroup)
    
router.route('/:groupID')
    .post(verifyToken,Group.joinGroup)
    .get(verifyToken,Group.getOneGroup)
    .put(verifyToken,upload.single('image',1),Group.updateGroup)

router.route('/')
    .get(verifyToken,Group.getGroup)
    .post(verifyToken,upload.single('image',20),Group.newGroup)

module.exports = router 

