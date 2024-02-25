const Cluck = require('../models/cluckModel');
const mongoose = require('mongoose');

// GET all clucks
const getAllClucks = async (req, res) => {
  const clucks = await Cluck.find({}).sort({ createdAt: -1 });

  res.status(200).json(clucks);
};

// GET a single cluck
const getCluck = async (req, res) => {
  const { id } = req.params;

  const cluck = await Cluck.findById(id);

  if (!cluck) {
    res.status(404).json({ error: 'Cluck not found' });
  } else {
    res.status(200).json(cluck);
  }
};

// DELETE a cluck
const deleteCluck = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  const cluck = await Cluck.findByIdAndDelete(id);

  if (!cluck) {
    return res.status(404).json({ error: 'Cluck not found' });
  }
};

// POST a new cluck
const postCluck = async (req, res) => {
  const { text } = req.body;

  try {
    const cluck = await Cluck.create({ text });
    res.status(200).json(cluck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH (edit) a cluck
const editCluck = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  const cluck = await Cluck.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!cluck) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  res.status(200).json(cluck);
};

module.exports = {
  getAllClucks,
  getCluck,
  postCluck,
  editCluck,
  deleteCluck,
};
