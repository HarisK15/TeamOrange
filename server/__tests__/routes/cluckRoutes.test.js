require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/user.js");
const Cluck = require("../../models/cluckModel.js");
const { hashPassword, createSecretToken } = require("../../helpers/auth.js");
const { setupDatabase, teardownDatabase } = require("../utils/dbSetup.js");

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(setupDatabase);
afterAll(teardownDatabase);

const createCluck = async (text, user) => {
  return await Cluck.create({ text, user });
};

const performRequest = async (method, url, token, body) => {
  const req = request(app)[method](url);
  if (token) {
    req.set("Cookie", `token=${token}`);
  }
  if (body) {
    req.send(body);
  }
  return await req;
};

const createUserAndToken = async (email, password, userName) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ email, password: hashedPassword, userName });
  const token = await createSecretToken(
    user._id.toString(),
    process.env.JWT_SECRET
  );
  return { user, token };
};

beforeEach(async () => {
  await User.deleteMany({});
  await Cluck.deleteMany({});

  const { user, token: newToken } = await createUserAndToken(
    "test@test.test",
    "password123",
    "testUser"
  );
  token = newToken;

  const newCluck = await createCluck("This is part of a test!", user);
  newCluckId = newCluck._id;
});

describe("Cluck Routes", () => {
  it("POST / - should create a new cluck", async () => {
    const newCluck = { text: "This is another test!" };
    const response = await performRequest("post", "/clucks", token, newCluck);
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
    const response = await performRequest(
      "delete",
      `/clucks/${newCluckId}`,
      token
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Cluck deleted successfully");
  });

  it("DELETE /:id - should not delete a cluck if the user is not the author", async () => {
    const { token: token2 } = await createUserAndToken(
      "test2@test.test",
      "password123",
      "testUser2"
    );
    const response = await performRequest(
      "delete",
      `/clucks/${newCluckId}`,
      token2
    );
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("You can only delete your own clucks");
  });

  it("PATCH /:id - should edit a cluck", async () => {
    const updatedData = { text: "This should be the updated text for a test!" };
    const response = await performRequest(
      "patch",
      `/clucks/${newCluckId}`,
      token,
      updatedData
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(updatedData.text);
  });

  it("PATCH /:id - should not edit a cluck if the user is not the author", async () => {
    const { token: token2 } = await createUserAndToken(
      "test2@test.test",
      "password123",
      "testUser2"
    );
    const updatedData = { text: "This should be the updated text for a test!" };
    const response = await performRequest(
      "patch",
      `/clucks/${newCluckId}`,
      token2,
      updatedData
    );
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("You can only edit your own clucks");
  });
});
