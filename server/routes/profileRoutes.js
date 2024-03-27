//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { changeBio, getProfileData } = require('../controllers/profileController');
const { userVerification } = require("../middleware/verifyUser");

// Middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);

// POST requests
router.post('/', userVerification, changeBio);

// GET requests
router.get('/userData/:profileId', getProfileData);

module.exports = router;