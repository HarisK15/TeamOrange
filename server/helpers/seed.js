const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/user');
const Cluck = require('../models/cluckModel');
const { faker } = require('@faker-js/faker');
const { hashPassword } = require('./auth');

const startDatabase = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log('Database connected');
    })
    .catch((err) => console.log('Database connection error', err));
};

const numberOfUsers = 100;

//Generates a random number from 0 to the given number
async function randomNumber(num) {
  return Math.floor(Math.random() * num);
}

function randomDate(start, end) {
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  const randomTimestamp =
    startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  return new Date(randomTimestamp);
}

async function seedDatabase() {
  try {
    await startDatabase();
    while ((await User.countDocuments({})) < numberOfUsers) {
      try {
        const userData = {
          userName: faker.person.fullName(),
          email: faker.internet.email(),
          bio: faker.lorem.paragraphs(await randomNumber(4), '\n\n'),
          password: await hashPassword('testPassword'),
          privacy: Math.random() < 0.5,
          isVerified: true,
        };

        const user = await User.create(userData);
        process.stdout.write(
          `Seeding users ${await User.countDocuments({})}/${numberOfUsers}\n`
        );
        await seedClucks(user);
      } catch (error) {}
    }
    await seedFollowersAndBlocked();
    await seedLikesAndReclucks();

    console.log(
      `Seeding complete. ${numberOfUsers} users created. ${await Cluck.countDocuments({})} clucks created`
    );
  } catch (error) {
    console.error('Seeding Database error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Database disconnected');
  }
}

async function seedClucks(user) {
  //Create 0 to 6 clucks per user
  const numberOfClucks = await randomNumber(6);
  let i = 0;
  while (i < numberOfClucks) {
    try {
      const createdAt = randomDate(new Date(2022, 0, 1), new Date());
      const updatedAt = randomDate(createdAt, new Date());

      const cluckData = {
        text: faker.lorem.paragraphs(await randomNumber(3), '\n\n'),
        user: user._id,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
      await Cluck.create(cluckData);
      i++;
      process.stdout.write(
        `Seeding random clucks per user ${i}/${numberOfClucks}\n`
      );
    } catch (error) {}
  }
}

async function seedFollowersAndBlocked() {
  try {
    const allUsers = await User.find({}, '_id');

    let i = 0;
    for (const currentUser of allUsers) {
      const shuffledUserIds = allUsers.map((user) => user._id)
        .filter((userId) => userId.toString() !== currentUser._id)
        .sort(() => Math.random() - 0.5);

      // Generate a random number of users to follow (currently between (0 and the total number of users - 1)/2)
      const numberOfFollowing = Math.floor(
        (Math.random() * (shuffledUserIds.length - 1)/2)
      );

      const followingIds = shuffledUserIds.slice(0, numberOfFollowing);
      // Generate a random number of users to block (currently numberOfFollowing/5 subtracted from shuffledUserIds)
      const blockedIds = shuffledUserIds.slice((shuffledUserIds.length-(numberOfFollowing/5)));

      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: { 
          following: { $each: followingIds },
          blocked: { $each: blockedIds }
        }
      });

      for (const currentFollowerId of followingIds) {
        await User.findByIdAndUpdate(currentFollowerId, {
          $addToSet: { followers: currentUser._id },
        });
      }
      i++;
      process.stdout.write(`Seeding user followers/Blocked users ${i}/${shuffledUserIds.length}\n`);
    }

    console.log('User Followers/Blocked seeded successfully.');
  } catch (error) {
    console.error('Error seeding followers/blocked:', error);
  }
}

async function seedLikesAndReclucks() {
  try {
    const allUsers = await User.find({}, '_id');

    const allClucks = await Cluck.find({}, '_id');

    let i = 0;
    for (const currentCluck of allClucks) {
      const shuffledUserIds = allUsers.map((user) => user._id)
        .filter((userId) => userId !== currentCluck.user) 
        .sort(() => Math.random() - 0.5);

      //Generates a random number of users to like the cluck (currently between (0 and the total number of users - 1)/2)
      const numberOfLiking = Math.floor(
        (Math.random() * (shuffledUserIds.length - 1)/2)
      );
        
      const likingIds = shuffledUserIds.slice(0, numberOfLiking);
      //Generates a random number of users to recluck the cluck (currently between (0 and the number of users liking/4))
      const recluckIds = shuffledUserIds.slice(0, (await randomNumber(numberOfLiking))/4);

      const cluck = await Cluck.findOneAndUpdate(
        { _id: currentCluck._id },
        { $addToSet: { likedBy: { $each: likingIds } } },
        { new: true }
      );
      for (const reClucker of recluckIds){
        const filteredRecluckLikeIds = shuffledUserIds.filter(userId => userId !== reClucker._id);
        //Generates a random number of users to like the recluck (currently (between 0 to numberOfLiking) subtracted from filteredRecluckLikeIds)
        const likeRecluckIds = filteredRecluckLikeIds.slice(filteredRecluckLikeIds.length - await randomNumber(numberOfLiking));
        await Cluck.create({ 
          text: cluck.text, 
          user: cluck.user, 
          recluckUser: reClucker._id, 
          recluck: true, 
          likedBy: likeRecluckIds,
        });
      }
      i++;
      process.stdout.write(`Seeding cluck likes and reclucks ${i}/${allClucks.length}\n`);
    }
    console.log('Likes and Reclucks seeded successfully.');
  } catch (error) {
    console.error('Error seeding likes/reclucks:', error);
  }
}

seedDatabase();
