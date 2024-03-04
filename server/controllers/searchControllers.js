const User = require("../models/user");
const Cluck = require("../models/cluckModel");

const searchUsers = async (query) => {
  const users = await User.find({
    userName: { $regex: new RegExp(query, "i") },
  });
  return users;
};

const searchClucks = async (query) => {
  const clucks = await Cluck.find({
    text: { $regex: new RegExp(query, "i") },
  }).populate("user", "userName");
  return clucks;
};

const search = async (req, res) => {
  try {
    const query = req.query.q;
    const users = await searchUsers(query);
    const clucks = await searchClucks(query);
    res.json({ users, clucks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { search, searchUsers, searchClucks };
