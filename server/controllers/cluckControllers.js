const Cluck = require('../models/cluckModel');
const User = require('../models/user');
const mongoose = require('mongoose');

// GET all clucks
const getAllClucks = async (req, res) => {
  const userId = req.userId.toString();

  let clucks = await Cluck.find({})
    .populate('user', 'userName followers following privacy blocked')
    .sort({ createdAt: -1 });

  clucks = clucks.filter((cluck) => {
    const { user } = cluck;
    if (user.blocked.includes(userId)) {
      return false;
    }
    if (
      user?.followers?.includes(userId) &&
      user?.following?.includes(userId)
    ) {
      return true;
    } else if (!user?.privacy) {
      // If privacy is false, allow access to all clucks
      return true;
    }
  });

  // Sort clucks by createdAt
  clucks.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json(clucks);
};

//GET all clucks by a user
const getClucksByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const requestingUser = req.userId.toString();

    const userForClucks = await User.findById(userId);

    if (!userForClucks) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = await User.findById(requestingUser);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSeeingOwnProfile = requestingUser === userId;
    const isFollowing = user.following.includes(userId);
    const isFollowingBack = userForClucks.following.includes(requestingUser);
    const isBlocked = userForClucks.blocked.includes(requestingUser);

    if (
      isBlocked ||
      (userForClucks.privacy &&
        !isSeeingOwnProfile &&
        !(isFollowing && isFollowingBack))
    ) {
      res.status(200).json([]);
      return;
    }
    const clucks = await Cluck.find({ user: userId }).populate('user').exec();

    res.status(200).json(clucks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET a single cluck
const getCluck = async (req, res) => {
  const { id } = req.params;

  const cluck = await Cluck.findById(id).populate('user', 'userName');

  if (!cluck) {
    res.status(404).json({ error: 'Cluck not found' });
  } else {
    res.status(200).json(cluck);
  }
};

// DELETE a cluck
const deleteCluck = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const cluck = await Cluck.findById(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  if (cluck.user._id.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: 'You can only delete your own clucks' });
  }

  await Cluck.findByIdAndDelete(id);

  if (!cluck) {
    return res.status(404).json({ error: 'Cluck not found' });
  } else {
    res.status(200).json({ message: 'Cluck deleted successfully' });
  }
};

// POST a new cluck
const postCluck = async (req, res) => {
  try {
    const { text } = req.body;
    const author = await User.findById(req.userId);

    if (!author) {
      return res.status(400).json({ error: 'User not found' });
    }

    const cluck = await Cluck.create({ text: text, user: author });

    res.status(200).json(cluck);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const likeCluck = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const cluck = await Cluck.findById(id);
  if (!cluck) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  if (cluck.user._id.toString() == userId.toString()) {
    return res.status(403).json({ message: 'You cannot like your own clucks' });
  }
  let updatedCluck = cluck;
  if (req.body.liked) {
    updatedCluck = await Cluck.findOneAndUpdate(
      { _id: id },
      { $addToSet: { likedBy: userId } },
      { new: true }
    );
  } else {
    updatedCluck = await Cluck.findOneAndUpdate(
      { _id: id },
      { $pull: { likedBy: userId } },
      { new: true }
    );
  }

  res.status(200).json(updatedCluck);
};

// PATCH (edit) a cluck
const editCluck = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const cluck = await Cluck.findById(id);
  if (!cluck) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  if (cluck.user._id.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: 'You can only edit your own clucks' });
  }

  if (!cluck) {
    return res.status(404).json({ error: 'Cluck not found' });
  }

  const updatedCluck = await Cluck.findOneAndUpdate(
    { _id: id },
    { text: req.body.text },
    { new: true }
  );

  res.status(200).json(updatedCluck);
};

module.exports = {
  getAllClucks,
  getCluck,
  postCluck,
  editCluck,
  deleteCluck,
  likeCluck,
  getClucksByUser,
};
