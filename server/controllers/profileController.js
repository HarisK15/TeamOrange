const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const changeBio = async (req, res) => {
  try {
    const { bio } = req.body;

    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (bio.length > 200) {
      return res
        .status(400)
        .json({ error: 'A bio should not be longer than 200 characters' });
    }

    user.bio = bio;
    await user.save();
    return res.status(200).json({ message: 'Bio updated successfully' });
  } catch (error) {
    console.error('Error updating bio:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePrivacy = async (req, res) => {
  try {
    const { privacy } = req.body;

    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.privacy = privacy;
    await user.save();
    return res.status(200).json({ message: 'Privacy updated successfully' });
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBlock = async (req, res) => {
  try {
    const { block } = req.body;
    const { id } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userToBlock = await User.findById(id);

    if (!userToBlock) {
      return res.status(404).json({ error: 'User not found' });
    }

    // await User.updateMany({}, { blocked: [] });

    if (block) {
      await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { blocked: id } },
        { new: true }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { blocked: id } },
        { new: true }
      );
    }

    res.status(200).json({ message: 'Block updated successfully' });
  } catch (error) {
    console.log('error :', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfileData = async (req, res) => {
  await User.updateMany(
    {
      privacy: { $exists: false },
    },
    { $set: { privacy: true } }
  );
  try {
    const { profileId } = req.params;
    const user = await User.findById(profileId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      bio: user.bio,
      userName: user.userName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      privacy: user.privacy,
      blocked: user.blocked,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { changeBio, getProfileData, updatePrivacy, updateBlock };
