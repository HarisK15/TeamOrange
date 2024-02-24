const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

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

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ status: false });
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  createSecretToken,
  userVerification,
};
