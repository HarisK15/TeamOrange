const Cluck = require("../models/cluckModel");
const User = require("../models/user");
const mongoose = require("mongoose");

// GET all clucks
const getAllClucks = async (req, res) => {
  const clucks = await Cluck.find({}).populate("user", "userName").sort({ createdAt: -1 });

  res.status(200).json(clucks);
};

// GET a single cluck
const getCluck = async (req, res) => {
  const { id } = req.params;

  const cluck = await Cluck.findById(id).populate("user", "userName");

  if (!cluck) {
    res.status(404).json({ error: "Cluck not found" });
  } else {
    res.status(200).json(cluck);
  }
};

// DELETE a cluck

// POST a new cluck
const postCluck = async (req, res) => {
  try {
    const { user, text } = req.body;
    const author = req.user;

    if (!author) {
      return res.status(400).json({ error: "User not found" });
    }

    const cluck = await Cluck.create({ text: text, user: author });

    res.status(200).json(cluck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH (edit) a cluck
const editCluck = async (req, res) => {
  const { id } = req.params;
  const reqUserId = req.user._id;

  const cluck = await Cluck.findById(req.params.id);
  if (cluck.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You can only edit your own clucks" });
  }

  if (!cluck) {
    return res.status(404).json({ error: "Cluck not found" });
  }

  Cluck.findOneAndUpdate({ _id: id }, { ...req.body });

  res.status(200).json(cluck);
};

module.exports = {
  getAllClucks,
  getCluck,
  postCluck,
  editCluck,
};
