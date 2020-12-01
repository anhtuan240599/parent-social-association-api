const express = require('express')
const router = require('express-promise-router')()
const verifyToken = require('../middlewares/verify-token');
const addressController = require('../controllers/address.controller')

router.route('/')
    .post(verifyToken,addressController.postAddress)
    .get(verifyToken,addressController.getAddress)
    

router.route('/country')
    .get(addressController.getCountry)

router.route('/:id')
    .get(verifyToken,addressController.getOneAddress)
    .put(verifyToken,addressController.putOneAddress)
    .delete(verifyToken,addressController.deleteOneAddress)

router.route('/set/default').put(verifyToken,addressController.setDefaultAddress)
module.exports = router;