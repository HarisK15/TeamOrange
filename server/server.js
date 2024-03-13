const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const path = require("path");
const express = require("express");


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // console.log("Database connected");
    // const port = 8000;
    // if (process.env.NODE_ENV !== "test") {
    //   app.listen(port, () => console.log(`Server is running on port ${port}`));
    //   app.get("/", (req, res) => {
    //     res.json("not this one");
    //   });
    // }
    if(process.env.NODE_ENV === "production") {
      const port = process.env.PORT || 8000;
      app.use(express.static(path.join(__dirname, "../client/dist")));
      app.listen(port, () => console.log(`Server is running on port ${port}`));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
      })
    } else{
      app.get("/", (req, res) => {
        res.send("API is running");
      });
    }
  })
  .catch((err) => console.log("Database connection error", err));


// Import and use routes after the database connection is established
  app.use("/routes", require("./routes/authRoutes"));
  app.use("/clucks", require("./routes/cluckRoutes"));
  app.use("/change-password", require("./routes/passwordRoutes"));
  app.use("/profile", require("./routes/profileRoutes"));
  app.use("/search", require("./routes/searchRoutes"));