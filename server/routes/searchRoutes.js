const express = require('express');
const cors = require('cors');
const {
  search,
  getUsersToFollow,
} = require('../controllers/searchControllers');
const { userVerification } = require('../middleware/verifyUser');
const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

router.get('/', userVerification, search);

router.get('/users/whoToFollow', userVerification, getUsersToFollow);

module.exports = router;
