//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors');
const { changePassword } = require('../controller/passwordController');

// Middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);

// POST requests
router.post('/change-password', changePassword); // Route for changing passwords

module.exports = router;