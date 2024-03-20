const User = require('../models/user');
const Cluck = require('../models/cluckModel');

const searchUsers = async (query) => {
  const users = await User.find({
    userName: { $regex: new RegExp(query, 'i') },
  });
  return users;
};

const searchClucks = async (query, userId) => {
  let clucks = await Cluck.find({
    text: { $regex: new RegExp(query, 'i') },
  }).populate('user', 'userName followers following privacy');

  clucks = clucks.filter((cluck) => {
    const { user } = cluck;
    if (!user.privacy) {
      // If privacy is false, allow access to all clucks
      return true;
    } else {
      // If privacy is true, check if user is a follower or is being followed by the cluck author
      return user.followers.includes(userId) && user.following.includes(userId);
    }
  });

  // Sort clucks by createdAt
  clucks.sort((a, b) => b.createdAt - a.createdAt);

  return clucks;
};

const search = async (req, res) => {
  try {
    const query = req.query.q;
    const users = await searchUsers(query);
    const clucks = await searchClucks(query, req.userId);
    res.json({ users, clucks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all users to follow,
const getUsersToFollow = async (req, res) => {
  const userId = req.userId.toString();

  let users = await User.find({
    followers: { $nin: [userId] },
  }).sort({ createdAt: -1 });

  res.status(200).json(users.slice(0, 5));
};

module.exports = { search, searchUsers, searchClucks, getUsersToFollow };
