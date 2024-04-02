const Notification = require('../models/notificationModel');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification == null) {
      return res.status(404).json({ message: 'Cannot find notification' });
    }
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNotification = async (req, res) => {
  const notification = new Notification({
    message: req.body.message,
    type: req.body.type,
    user: req.body.user,
  });

  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification == null) {
      return res.status(404).json({ message: 'Cannot find notification' });
    }

    if (req.body.message != null) {
      notification.message = req.body.message;
    }
    if (req.body.type != null) {
      notification.type = req.body.type;
    }
    if (req.body.read != null) {
      notification.read = req.body.read;
    }

    const updatedNotification = await notification.save();
    res.status(200).json(updatedNotification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification == null) {
      return res.status(404).json({ message: 'Cannot find notification' });
    }

    await notification.remove();
    res.status(200).json({ message: 'Deleted Notification' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};