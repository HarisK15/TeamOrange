const supertest = require("supertest");
const app = require("../../app.js");
const request = supertest(app);
const User = require("../../models/user.js");
const { hashPassword, createSecretToken } = require("../../helpers/auth.js");
const { setupDatabase, teardownDatabase } = require("../utils/dbSetup.js");

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(setupDatabase);
afterAll(teardownDatabase);

describe("Follower Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("POST /follow/:id - should follow a user", async () => {
    const user = await User.create({
      email: "test@test.com",
      password: await hashPassword("password123"),
      userName: "testUser",
    });

    const token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );

    const response = await request
      .post(`/follow/${user._id}`)
      .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User followed successfully");
  });

  it("POST /unfollow/:id - should unfollow a user", async () => {
    const user = await User.create({
      email: "test@test.com",
      password: await hashPassword("password123"),
      userName: "testUser",
    });

    const user2 = await User.create({
      email: "test2@test.com",
      password: await hashPassword("password123"),
      userName: "testUser2",
      followers: [user._id],
    });

    user.following.push(user2._id);

    const token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );

    const response = await request
      .post(`/unfollow/${user2._id}`)
      .set("Cookie", `token=${token}`);

    const updatedUser = await User.findById(user._id);
    const updatedUser2 = await User.findById(user2._id);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User unfollowed successfully");
    expect(updatedUser.following.length).toBe(0);
    expect(updatedUser2.followers.length).toBe(0);
  });

  it("GET /followers/:id - should get a user's followers", async () => {
    const follower1 = await User.create({
      email: "follower1@test.com",
      password: await hashPassword("password123"),
      userName: "follower",
    });

    const follower2 = await User.create({
      email: "follower2@test.com",
      password: await hashPassword("password123"),
      userName: "follower2",
    });

    const user = await User.create({
      email: "test@test.com",
      password: await hashPassword("password123"),
      userName: "testUser",
      followers: [follower1._id, follower2._id],
    });

    follower1.following.push(user._id);
    follower2.following.push(user._id);

    const token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );

    const response = await request
      .get(`/followers/${user._id}`)
      .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("GET /following/:id - should get a user's following", async () => {
    const following1 = await User.create({
      email: "following1@test.com",
      password: await hashPassword("password123"),
      userName: "following1",
    });

    const following2 = await User.create({
      email: "following2@test.com",
      password: await hashPassword("password123"),
      userName: "following2",
    });

    const user = await User.create({
      email: "test5@test.com",
      password: await hashPassword("password123"),
      userName: "testUser5",
      following: [following1._id, following2._id],
    });

    const token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );

    const response = await request
      .get(`/following/${user._id}`)
      .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
