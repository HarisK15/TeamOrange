//This file is for creating API endpoints
const express = require('express');
const router = express.Router();
const cors = require('cors')
const { test, registerUser, loginUser} = require('../controllers/authControllers');
const { userVerification } = require('../helpers/auth');

//middleware
router.use(
    cors(
        {
            credentials:true,
            origin: 'http://localhost:5173'
        }
    )
)

//GET requests
router.get('/', test)

//POST requests
router.post('/', userVerification)
router.post('/register',registerUser)
router.post('/login',loginUser)

//always export file
module.exports = router