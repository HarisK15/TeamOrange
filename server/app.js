//import statements
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Import and use routes after the database connection is established
app.use("/", require("./routes/authRoutes"));
app.use("/clucks", require("./routes/cluckRoutes"));
app.use("/change-password", require("./routes/passwordRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/search", require("./routes/searchRoutes"));
app.use("/", require("./routes/followerRoutes"));

module.exports = app;
