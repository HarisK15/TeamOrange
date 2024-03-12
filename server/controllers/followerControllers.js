const User = require("../models/user");
const mongoose = require("mongoose");

// Follow a user
const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const userToFollow = await User.findById(id);
    const user = await User.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userToFollow.followers.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    userToFollow.followers.push(userId);
    user.following.push(id);

    await userToFollow.save();
    await user.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "User not found" });
  }

  const userToUnfollow = await User.findById(id);
  const user = await User.findById(userId);

  if (!userToUnfollow) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!userToUnfollow.followers.includes(userId)) {
    return res.status(400).json({ error: "You are not following this user" });
  }

  userToUnfollow.followers = userToUnfollow.followers.filter(
    (follower) => follower.toString() !== userId.toString()
  );
  user.following = user.following.filter(
    (follow) => follow.toString() !== id.toString()
  );

  await userToUnfollow.save();
  await user.save();

  res.status(200).json({ message: "User unfollowed successfully" });
};

// Get followers
const getFollowers = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = await User.findById(id).populate("followers");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user.followers);
};

// Get following
const getFollowing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "User not found" });
  }

  const user = await User.findById(id).populate("following");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user.following);
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing };
