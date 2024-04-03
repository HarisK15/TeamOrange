const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const cors = require("cors");
router.use(
	cors({
	  credentials: true,
	  origin: "http://localhost:5173",
	})
  );

router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotification);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;