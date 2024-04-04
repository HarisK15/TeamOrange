//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { uploadProfileImage } = require('../controllers/profileController');
const { upload } = require('../middleware/uploadProfile');
const profileController = require('../controllers/profileController');

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

// POST requests for uploading profile image
router.post('/profileImage',userVerification, upload.single('profileImage'), uploadProfileImage);

const path = require('path');

// GET route for fetching profile image
router.get('/profileImage/:userId', userVerification, profileController.getProfileImage);
// GET requests
router.get('/userData/:profileId', getProfileData);

module.exports = router;
