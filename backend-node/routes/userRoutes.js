const express = require('express');
const { donate , getUserFoodListings } = require('../controllers/userController');
const router = express.Router();

router.post('/donate', donate);

router.get('/food-listings/:id', getUserFoodListings);


module.exports = router;