const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

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
