const express = require('express');
const { getAllClucks, getCluck, postCluck, editCluck } = require('../controllers/cluckControllers');
const cors = require('cors')

const router = express.Router();

router.use(
    cors(
        {
            credentials:true,
            origin: 'http://localhost:5173'
        }
    )
)

// GET all clucks
router.get('/', getAllClucks);

// GET a single cluck
router.get('/:id', getCluck);

// DELETE a cluck
router.delete('/:id', deleteCluck);

// POST a new cluck
router.post('/', postCluck);

// PATCH (edit) a cluck
router.patch('/:id', editCluck);

module.exports = router;
