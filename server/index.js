//import statements
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

//database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database not connected", err));

//middleware because this is the entry point for the backend
app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/authRoutes"));
app.use("/clucks", require("./routes/cluckRoutes"));
app.use("/", require("./routes/passwordRoutes") );
app.use("/profile", require("./routes/profileRoutes"))

//set up port to listen
const port = 8000;
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

module.exports = app;