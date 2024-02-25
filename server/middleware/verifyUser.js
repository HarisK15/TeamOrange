const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to verify that a user is logged in and then attaches the user's object id to the request object
const userVerification = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(data.id);

    if (!user) {
      return res.status(401).json({ status: false });
    }

    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ status: false });
  }
};

module.exports = { userVerification };
