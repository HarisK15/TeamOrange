//logic file/code for the routes/ api end points
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require("dotenv").config();
const {
  hashPassword,
  comparePassword,
  createSecretToken,
} = require("../helpers/auth");

const test = (req, res) => {
  res.json("test is working");
};

// Register endpoint
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    //check if userName was entered
    if (!userName) {
      return res.json({
        error: "User Name is required",
      });
    }
    //check if password meets criteria
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }
    //check email if it is already register in the database
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const hashedPassword = await hashPassword(password);
    //create user in database
    // still needs to hash the password
    const user = await User.create({
      userName,
      email,
      bio: "",
      password: hashedPassword,
      verificationToken: verificationToken,
    });

    const verificationLink = `https://cluckerteamorange-b4381c5c6c08.herokuapp.com/verify-email/${verificationToken}`;
    await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cluckeradmn@gmail.com', 
        pass: 'kbxtfjkwucdafbyt', 
      },
    })
    .sendMail({
      from: 'cluckeradmn@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please click the following link to verify your email address on Clucker: \n ${verificationLink}`,
    })
    .catch(error => {
      console.error('Error sending email:', error);
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//Login endpoint
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if email and password were entered
    if (!email || !password) {
      return res.json({ error: "All fields are required" });
    }

    //Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "No user found, please register first" });
    }

    //check if password match
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Passwords do not match",
      });
    }

    //check if user is verified
    if (!user.isVerified) {
      return res.json({
        error: "Please verify your account by clicking on the link we sent to your email via cluckeradmn@gmail.com.",
      });
    }

    //create token
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User logged out" });
};

// Check if the user is logged in and return id if they are
const checkLoginStatus = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      // Decode the token to get the user's information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Return the user's ID and login status
      return res.json({ isLoggedIn: true, userId: decoded.id });
    } catch (error) {
      console.error("Failed to decode token", error);
      return res.json({ isLoggedIn: false });
    }
  }
  return res.json({ isLoggedIn: false });
};

module.exports = {
  test,
  registerUser,
  loginUser,
  logoutUser,
  checkLoginStatus,
};
