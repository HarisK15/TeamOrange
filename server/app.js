//import statements
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware setup
app.use(express.json());
app.use(cookieParser());



module.exports = app;
