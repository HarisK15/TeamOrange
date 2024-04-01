const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user")
const Cluck = require("../models/cluckModel");

//Username of the user who's user model and related clucks will not be deleted
const excludeUserName = "admin";

const startDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => console.log("Database connection error", err));
}

async function unseedDatabase() {
  try {
    await startDatabase();
    const excludedUser = await User.findOne({ userName: excludeUserName });

    let numberOfClucks;
    if (excludedUser) {
        numberOfClucks = await Cluck.countDocuments({ user: { $ne: excludedUser._id } });
        await Cluck.deleteMany({ user: { $ne: excludedUser._id } });
        await Cluck.deleteMany({ replyTo: {$exists: true} });
        await Cluck.deleteMany({ recluck: true });
        await Cluck.updateMany(
          { user: excludedUser._id },
          { $unset: { replies: 1 } }
        );
    } else {
        numberOfClucks = await Cluck.countDocuments();
        await Cluck.deleteMany();
    }

    const numberOfUsers = await User.countDocuments();

    if (excludedUser) {
        await User.deleteMany({ _id: { $ne: excludedUser._id } });
        await User.updateOne({ _id: excludedUser._id }, { $set: { followers: [], following: [], blocked: [] } });
        console.log(`Unseeding complete. ${numberOfUsers - 1} users deleted. ${numberOfClucks} clucks deleted`);
    } else {
        await User.deleteMany();
        console.log(`Unseeding complete. ${numberOfUsers} users deleted. ${numberOfClucks} clucks deleted`);
    }
  } catch (error) {
      console.error('Unseeding error:', error);
  } finally {
      mongoose.disconnect();
      console.log("Database disconnected");
  }
}


unseedDatabase();