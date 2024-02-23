const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose"); 
require("dotenv").config("../.env");
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.js'); 
const { hashPassword } = require('../helpers/auth.js')

let mongoServer;

beforeAll(async () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      await mongoose.disconnect();
    }
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
});
  
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});


beforeEach(async () => {
    await User.deleteMany({});
    
    const hashedPassword = await hashPassword('password123');
    await User.create({
        email: 'test@example.com',
        password: hashedPassword, 
        userName: 'testUser'
    });
});

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
);
  
describe("Password Routes", () => {
    it("POST /change-password - should update a user model with a new password", async () => {
      const agent = request.agent(app);

      // Simulate a session with userEmail set
      const sessionData = { userEmail: "test@example.com" };

      const cookie = session.serialize("testCookie", sessionData);

      const response = await agent
        .post("/change-password")
        .set("Cookie", cookie)
        .send({
          currentPassword: "password123",
          newPassword: "Password123",
        });

      expect(response.statusCode).toBe(200);
    });

    it("POST /change-password - will fail to update a user model with a new password", async () => {
        const agent = request.agent(app);
  
        // Simulate a session with userEmail set
        const sessionData = { userEmail: "test@example.com" };
  
        const cookie = session.serialize("testCookie", sessionData);
  
        const response = await agent
          .post("/change-password")
          .set("Cookie", cookie)
          .send({
            currentPassword: "password123",
            newPassword: "short",
          });
  
        expect(response.statusCode).toBe(400);
      });
});