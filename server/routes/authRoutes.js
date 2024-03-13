//This file is for creating API endpoints
const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  registerUser,
  loginUser,
  logoutUser,
  checkLoginStatus,
} = require("../controllers/authControllers");

//middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

//GET requests
//router.get("/", test);
router.get("/check-login", checkLoginStatus);

//POST requests
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

//always export file
module.exports = router;
