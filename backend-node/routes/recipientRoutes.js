const express = require('express');
const router = express.Router();
const { RequestFood , claimFood , getFoodReq  } = require('../controllers/recipientController');

router.post('/req', RequestFood);

router.get('/claim/:id', claimFood);

router.get('/req/:id', getFoodReq);

module.exports = router;