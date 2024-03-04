const supertest = require("supertest");
const app = require("../../app.js");
const request = supertest(app);
const User = require("../../models/user.js");
const { hashPassword } = require("../../helpers/auth.js");
const { setupDatabase, teardownDatabase } = require("../utils/dbSetup.js");

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(async () => {
  setupDatabase();
});

afterAll(async () => {
  teardownDatabase();
});

beforeEach(async () => {
  // Clear the users collection before each test
  await User.deleteMany({});

  // Creating a user
  const hashedPassword = await hashPassword("password123");
  await User.create({
    email: "test@example.com",
    password: hashedPassword,
    userName: "testUser",
  });
});

describe("User Login", () => {
  it("should log in an existing user successfully", async () => {
    const response = await request.post("/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("success", true);
  });

  it("should fail if the email does not exist", async () => {
    const response = await request.post("/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "error",
      "No user found, please register first"
    );
  });

  it("should fail if the password is incorrect", async () => {
    const response = await request.post("/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("error", "Passwords do not match");
  });
});
