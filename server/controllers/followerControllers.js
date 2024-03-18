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
    res.status(500).json({ error: "Server error" });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get followers
const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const populatedUser = await user.populate("followers")

    res.status(200).json(populatedUser.followers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get following
const getFollowing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const populatedUser = await user.populate("following");

    res.status(200).json(populatedUser.following);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Check if user is following another user
const isFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "User not found" });
    }
  
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    if (!user.following.includes(id)) {
      return res.status(200).json({ isFollowing: false });
    }
  
    res.status(200).json({ isFollowing: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
};
