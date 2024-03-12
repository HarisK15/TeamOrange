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

const numberOfUsers = 10; 

const randomNumber = Math.floor(Math.random() * 6);

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
                    bio: faker.lorem.paragraphs(randomNumber, '\n\n'),
                    password: await hashPassword(faker.internet.password({ length: 8 })),
                };
    
                const user = await User.create(userData);
                process.stdout.write(`Seeding users ${ await User.countDocuments({})}/${numberOfUsers}\n`);
                await seedClucks(user)
            } catch (error){
                console.error('Seeding error:', error);
            }
        }

        console.log(`Seeding complete. ${numberOfUsers} users created. ${await Cluck.countDocuments({})} clucks created`);
    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        mongoose.disconnect();
        console.log("Database disconnected");
    }
}

async function seedClucks(user) {
    // currently creating 0 - 5 clucks per user, change 6 to vary number of clucks created per user
    const numberOfClucks = Math.floor(Math.random() * 6);
    let i = 0;
    while (i < numberOfClucks) {
        try {
            const createdAt = randomDate(new Date(2022, 0, 1), new Date());
            const updatedAt = randomDate(createdAt, new Date());

            const cluckData = {
                text: faker.lorem.paragraphs(randomNumber, '\n\n'),
                user: user._id,
                createdAt: createdAt,
                updatedAt: updatedAt,
            }
            await Cluck.create(cluckData);
            i++
            process.stdout.write(`Seeding random clucks per user ${i}/${numberOfClucks}\n`);
        } catch (error){

        }
    }
}

seedDatabase();