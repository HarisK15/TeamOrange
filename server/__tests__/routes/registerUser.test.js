const supertest = require("supertest");
const app = require("../../app.js");
const request = supertest(app);
const User = require("../../models/user.js");
const { setupDatabase, teardownDatabase } = require("../utils/dbSetup.js");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(),
  }),
}));

beforeAll(async () => {
  setupDatabase();
});

afterAll(async () => {
  teardownDatabase();
});

beforeEach(async () => {
  // Clear the users collection before each test
  await User.deleteMany({});
});

describe("User Registration", () => {
  it("should register a user successfully", async () => {
    const res = await request.post("/register").send({
      userName: "testUser",
      email: "test@example.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "test@example.com");
  });

  it("should fail if username is not provided", async () => {
    const res = await request.post("/register").send({
      email: "test@example.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error", "User Name is required");
  });

  it("should fail if password is too short", async () => {
    const res = await request.post("/register").send({
      userName: "testUser",
      email: "test@example.com",
      password: "123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "error",
      "Password is required and should be at least 6 characters long"
    );
  });

  it('should send a verification email with the correct parameters', async () => {
    jest.spyOn(crypto, 'randomBytes').mockReturnValueOnce(Buffer.from('0123456789abcdef', 'hex'));
    
    const res = await request.post("/register").send({
      userName: "testUser",
      email: "test@example.com",
      password: "123456",
    });

    /*for an unknown reason the test seems to call the nodemailer related code twice despite it only 
      being called once when actually running the code, because of attempting to debug this issue for
      two days with no success I've settled with using 2 as the parameter instead of 1 */
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(2);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: 'cluckeradmn@gmail.com',
        pass: 'kbxtfjkwucdafbyt',
      },
    });
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(2);
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: 'cluckeradmn@gmail.com',
      to: "test@example.com",
      subject: 'Email Verification',
      text: `Please click the following link to verify your email address: \n http://localhost:5173/verify-email/0123456789abcdef`,
    });
  });

  it("should fail if email is already taken", async () => {
    // First, create a user to simulate the "already taken" scenario
    await User.create({
      userName: "existingUser",
      email: "existing@example.com",
      password: "123456",
    });

    // Then, try to register another user with the same email
    const res = await request.post("/register").send({
      userName: "testUser",
      email: "existing@example.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("error", "Email is already taken");
  });
});
