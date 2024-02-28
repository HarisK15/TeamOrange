//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { changeBio, getUserBio, getUserUsername, getUserEmail } = require('../controllers/profileController');
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
router.get('/bio', userVerification, getUserBio);
router.get('/username', userVerification, getUserUsername);
router.get('/email', userVerification, getUserEmail);

module.exports = router;