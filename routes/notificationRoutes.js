const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
//const { verifyToken } = require('../middlewares/authMiddleware'); // Optional

router.post('/notification',  notificationController.createNotification);
router.get('/notifications', notificationController.getNotifications);

module.exports = router;
