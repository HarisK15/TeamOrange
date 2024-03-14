const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/user")
const Cluck = require("../models/cluckModel");
const { faker } = require('@faker-js/faker');
const { hashPassword } = require("./auth");

const startDatabase = async () => {
    await mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
          console.log("Database connected");
        })
        .catch((err) => console.log("Database connection error", err));
}

const numberOfUsers = 100; 

async function randomNumber() {
    return Math.floor(Math.random() * 6);
}

function randomDate(start, end) {
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}


async function seedDatabase() {
    try {
        await startDatabase();
        while (await User.countDocuments({}) < numberOfUsers) {
            try{
                const userData = {
                    userName: faker.person.fullName(),
                    email: faker.internet.email(),
                    bio: faker.lorem.paragraphs(await randomNumber(), '\n\n'),
                    password: await hashPassword("testPassword"),
                };
    
                const user = await User.create(userData);
                process.stdout.write(`Seeding users ${ await User.countDocuments({})}/${numberOfUsers}\n`);
                await seedClucks(user)
            } catch (error){

            }
        }
        await seedFollowers();

        console.log(`Seeding complete. ${numberOfUsers} users created. ${await Cluck.countDocuments({})} clucks created`);
    } catch (error) {
        console.error('Seeding Database error:', error);
    } finally {
        mongoose.disconnect();
        console.log("Database disconnected");
    }
}

async function seedClucks(user) {
    // Generate a random number of clucks per user (currently between 0 to 5)
    const numberOfClucks = Math.floor(Math.random() * 6);
    let i = 0;
    while (i < numberOfClucks) {
        try {
            const createdAt = randomDate(new Date(2022, 0, 1), new Date());
            const updatedAt = randomDate(createdAt, new Date());

            const cluckData = {
                text: faker.lorem.paragraphs(await randomNumber(), '\n\n'),
                user: user._id,
                createdAt: createdAt,
                updatedAt: updatedAt,
            }
            await Cluck.create(cluckData);
            i++;
            process.stdout.write(`Seeding random clucks per user ${i}/${numberOfClucks}\n`);
        } catch (error){

        }
    }
}

async function seedFollowers() {
    try {
        const allUsers = await User.find({}, '_id'); 

        const randomUserIds = allUsers.map(user => user._id).sort(() => Math.random() - 0.5);
        let i = 0;
        for (const currentUser of allUsers) {
            // Generate a random number of users to follow (currently (between 0 and the total number of users - 2)/2)
            const numberOfFollowing = Math.floor((Math.random() * (allUsers.length - 1))/2);

            const followingUserIds = randomUserIds.filter(userId => userId.toString() !== currentUser._id.toString());

            const followingIds = followingUserIds.slice(0, numberOfFollowing);

            await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: followingIds } });

            for (const currentFollowerId of followingIds) {
                await User.findByIdAndUpdate(currentFollowerId, { $addToSet: { followers: currentUser._id } });
            }
            i++;
            process.stdout.write(`Seeding user followers ${i}/${allUsers.length}\n`);
        }

        console.log('Users seeded successfully.');
    } catch (error) {

    }
}

seedDatabase();