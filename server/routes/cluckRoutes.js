const express = require('express');
const {
  getAllClucks,
  getCluck,
  postCluck,
  editCluck,
  deleteCluck,
  recluckCluck,
  getClucksByUser,
  likeCluck,
  replyCluck,
  getCluckReplies,
} = require('../controllers/cluckControllers');
const { userVerification } = require('../middleware/verifyUser');
const cors = require('cors');
const { upload } = require('../middleware/uploads');

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

// GET all clucks
router.get('/', userVerification, getAllClucks);

//Get all clucks by a user
router.get('/user/:userId', userVerification, getClucksByUser);

// GET a single cluck
router.get('/:id', getCluck);

// DELETE a cluck
router.delete('/:id', userVerification, deleteCluck);

// Like a cluck
router.patch('/like/:id', userVerification, likeCluck);

// POST a new cluck
router.post('/', userVerification, upload.single('image'), postCluck);

// POST a new cluck
router.post('/replyCluck/:id', userVerification, upload.single('image'),replyCluck);

//Get all cluck replies for a cluck
router.get('/replies/:cluckId', userVerification, getCluckReplies);

// PATCH (edit) a cluck
router.patch('/:id', userVerification, editCluck);

// Recluck a cluck
router.post('/:id/recluck', userVerification, recluckCluck);

module.exports = router;
