const express = require('express');
const { getAllClucks, getCluck, postCluck, editCluck } = require('../controllers/cluckControllers');

const router = express.Router();

// GET all clucks
router.get('/', getAllClucks);

// GET a single cluck
router.get('/:id', getCluck);

// DELETE a cluck

// POST a new cluck
router.post('/', postCluck);

// PATCH (edit) a cluck
router.patch('/:id', editCluck);

module.exports = router;
