//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { verifyEmail } = require('../controllers/verificationController');

// Middleware
router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

// POST requests
router.post('/:verificationToken', verifyEmail);

module.exports = router;