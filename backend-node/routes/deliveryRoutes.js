const express = require('express');
const { getAllListing } = require('../controllers/deliveryController');
const router = express.Router();

router.get('/foodlistings' , getAllListing)

module.exports = router;