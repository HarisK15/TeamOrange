const User = require('../models/user');

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken: verificationToken });

    if (!user) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.json({ message: 'Email verification successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {verifyEmail} ;