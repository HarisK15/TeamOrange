const express = require("express");
const cors = require("cors");
const { search } = require("../controllers/searchControllers");
const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/", search);

module.exports = router;
