//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
  changeBio,
  getProfileData,
  updatePrivacy,
  updateBlock,
} = require('../controllers/profileController');
const { userVerification } = require('../middleware/verifyUser');

// Middleware
router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

// POST requests
router.post('/', userVerification, changeBio);

// POST requests
router.post('/privacy', userVerification, updatePrivacy);

// Block requests
router.post('/block/:id', userVerification, updateBlock);

// GET requests
router.get('/userData/:profileId', getProfileData);

module.exports = router;
