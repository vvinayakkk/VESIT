const express = require('express');
const { getAllListing, acceptPickup, updateDeliveryStatus, getAgentDeliveries, getDeliveryHistory } = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

// Food listings routes
router.get('/foodlistings', getAllListing);

// Delivery routes
router.post('/pickup/:id', acceptPickup);
router.put('/delivery/:id', updateDeliveryStatus);
router.get('/deliveries/:agentId', getAgentDeliveries);
router.get('/history/:agentId', getDeliveryHistory);

module.exports = router;