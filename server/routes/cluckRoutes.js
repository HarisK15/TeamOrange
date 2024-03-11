const express = require("express");
const {
  getAllClucks,
  getCluck,
  postCluck,
  editCluck,
  deleteCluck,
  getClucksByUser,
} = require("../controllers/cluckControllers");
const { userVerification } = require("../middleware/verifyUser");
const cors = require("cors");

const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// GET all clucks
router.get("/", getAllClucks);

//Get all clucks by a user
router.get("/user/:userId", getClucksByUser);

// GET a single cluck
router.get("/:id", getCluck);

// DELETE a cluck
router.delete("/:id", userVerification, deleteCluck);

// POST a new cluck
router.post("/", userVerification, postCluck);

// PATCH (edit) a cluck
router.patch("/:id", userVerification, editCluck);

module.exports = router;
