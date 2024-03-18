const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
} = require("../controllers/followerControllers");
const { userVerification } = require("../middleware/verifyUser");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/follow/:id", userVerification, followUser);
router.post("/unfollow/:id", userVerification, unfollowUser);
router.get("/followers/:id", userVerification, getFollowers);
router.get("/following/:id", userVerification, getFollowing);
router.get("/isFollowing/:id", userVerification, isFollowing);

module.exports = router;
