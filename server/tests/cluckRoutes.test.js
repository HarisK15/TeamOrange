require("dotenv").config();
const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/user.js");
const Cluck = require("../models/cluckModel.js");
const { hashPassword, createSecretToken } = require("../helpers/auth.js");

const mongoServer = new MongoMemoryServer();
beforeAll(async () => {
  await mongoServer.start();
  const mongoUri = await mongoServer.getUri();

  if (mongoose.connection.readyState) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);

  // Create a user
  const hashedPassword = await hashPassword("password123");
  await User.create({
    email: "test@test.test",
    password: hashedPassword,
    userName: "testUser",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Cluck Routes", () => {
  let newCluckId;
  let token;

  beforeEach(async () => {
    const user = await User.findOne({ userName: "testUser" });

    token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );

    await Cluck.deleteMany({});

    // Create a new cluck
    const newCluck = await Cluck.create({
      text: "This is part of a test!",
      user: user,
    });
    newCluckId = newCluck._id;
  });

  afterEach(async () => {
    // Logout user
    await request(app).post("/logout");
  });

  it("POST / - should create a new cluck", async () => {
    const newCluck = { text: "This is another test!" };
    const response = await request(app)
      .post("/clucks")
      .set("Cookie", `token=${token}`)
      .send(newCluck);
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(newCluck.text);
  });

  it("GET / - should respond with all clucks", async () => {
    const response = await request(app).get("/clucks");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it("GET /:id - should respond with a single cluck", async () => {
    const response = await request(app).get(`/clucks/${newCluckId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe("This is part of a test!");
  });

  it("GET /:id - should respond with a 404 if the cluck is not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/clucks/${nonExistentId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Cluck not found");
  });

  it("DELETE /:id - should delete a cluck", async () => {
    const id = newCluckId;
    const response = await request(app).delete(`/clucks/${id}`);
    expect(response.statusCode).toBe(200);
  });

  it("PATCH /:id - should edit a cluck", async () => {
    const updatedData = { text: "This should be the updated text for a test!" };
    const response = await request(app)
      .patch(`/clucks/${newCluckId}`)
      .set("Cookie", `token=${token}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(updatedData.text);
  });

  it("PATCH /:id - should not edit a cluck if the user is not the author", async () => {
    const user = await User.create({
      email: "test2@test.test",
      password: "password123",
      userName: "testUser2",
    });

    const token2 = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );

    const updatedData = { text: "This should be the updated text for a test!" };
    const response = await request(app)
      .patch(`/clucks/${newCluckId}`)
      .set("Cookie", `token=${token2}`)
      .send(updatedData);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("You can only edit your own clucks");
  });
});
