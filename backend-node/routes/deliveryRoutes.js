const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

router.get('/:id', deliveryController.getDeliveryDetails);
router.post('/:id/location', deliveryController.updateLocation);
router.put('/:id/status', deliveryController.updateDeliveryStatus);

module.exports = router;
