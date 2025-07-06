// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { placeOrder, getOrdersByUser } = require('../controllers/orderController');

router.post('/place-order', placeOrder);

router.get('/user/:userId', getOrdersByUser);

module.exports = router;
