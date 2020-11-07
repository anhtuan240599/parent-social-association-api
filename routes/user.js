const express = require('express')

const userController = require('../controllers/user.controller')

const router = require('express-promise-router')()

const UserController = require('../controllers/user.controller')

router.route('/')
    .get(UserController.index)
    .post(userController.newUser)

module.exports = router