const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user")
const Cluck = require("../models/cluckModel");

//Email of the user who's user model and related clucks will not be deleted
const excludeUserEmail = "johndoe@example.org";

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
        const excludedUser = await User.findOne({ email: excludeUserEmail });
        const numberOfUsers = await User.countDocuments({}) - 1;
        const numberOfClucks = await Cluck.countDocuments({ user: { $ne: excludedUser._id } });

        if (!excludedUser) {
            console.error('User with the specified email not found.');
            return;
        }

        await Cluck.deleteMany({ user: { $ne: excludedUser._id } });

        await User.deleteMany({ _id: { $ne: excludedUser._id } });

        console.log(`Unseeding complete. ${numberOfUsers} users deleted. ${numberOfClucks} clucks deleted`);
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        mongoose.disconnect();
        console.log("Database disconnected");
    }
}


unseedDatabase();