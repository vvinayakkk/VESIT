const express = require('express');
const { donate, getUserFoodListings, getProfile, updateProfile, deleteProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// Donation routes
router.post('/donate', donate);

// Food listings routes
router.get('/food-listings/:id', getUserFoodListings);

// User profile routes
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.delete('/profile/:id', deleteProfile);

module.exports = router;