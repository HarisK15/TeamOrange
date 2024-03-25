require("dotenv").config();
const supertest = require("supertest");
const app = require("../../app.js");
const request = supertest(app);
const User = require("../../models/user.js");
const { hashPassword, createSecretToken } = require("../../helpers/auth.js");
const { setupDatabase, teardownDatabase } = require("../utils/dbSetup.js");

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(async () => {
  setupDatabase();
});

afterAll(async () => {
  teardownDatabase();
});

describe("Password Routes", () => {
  let token;

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany({});

    // Creating a user
    const hashedPassword = await hashPassword("password123");
    const user = await User.create({
      email: "test@example.com",
      password: hashedPassword,
      userName: "testUser",
    });

    token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );
  });

  afterEach(async () => {
    // Clear the users collection after each test
    await User.deleteMany({});

    // Logging out the user
    await request.post("/logout");
  });

  it("POST / - should change password successfully", async () => {
    const response = await request
      .post("/change-password")
      .set("Cookie", `token=${token}`)
      .send({
        currentPassword: "password123",
        newPassword: "newPassword123",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Password updated successfully"
    );
  });

  it("POST / - should fail if the current password is incorrect", async () => {
    const response = await request
      .post("/change-password")
      .set("Cookie", `token=${token}`)
      .send({
        currentPassword: "wrongpassword",
        newPassword: "newPassword123",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Current password is incorrect"
    );
  });

  it("POST / - should fail if the new password is too short", async () => {
    const response = await request
      .post("/change-password")
      .set("Cookie", `token=${token}`)
      .send({
        currentPassword: "password123",
        newPassword: "123",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "A new password is required and should be at least 6 characters long"
    );
  });

  it("POST / - should fail if the new password is the same as the current password", async () => {
    const response = await request
      .post("/change-password")
      .set("Cookie", `token=${token}`)
      .send({
        currentPassword: "password123",
        newPassword: "password123",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "A new password is required and should be at least 6 characters long"
    );
  });
});
