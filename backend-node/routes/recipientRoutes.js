const express = require('express');
const router = express.Router();
const { RequestFood, claimFood, getFoodReq, cancelRequest, getRecipientProfile, updateRecipientProfile } = require('../controllers/recipientController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Food request routes
router.post('/req', RequestFood);
router.get('/req/:id', getFoodReq);
router.put('/req/:id', claimFood);
router.delete('/req/:id', cancelRequest);
router.get('/profile/:id', getRecipientProfile);
router.put('/profile/:id', updateRecipientProfile);

module.exports = router;