const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const express = require('express');
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/profileImage', express.static(path.join(__dirname, 'profilers')));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
    const port = 8000;
    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => console.log(`Server is running on port ${port}`));
    }
  })
  .catch((err) => console.log("Database connection error", err));
