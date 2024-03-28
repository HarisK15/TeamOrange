require('dotenv').config();
const supertest = require('supertest');
const app = require('../../app.js');
const request = supertest(app);
const mongoose = require('mongoose');
const User = require('../../models/user.js');
const { hashPassword, createSecretToken } = require('../../helpers/auth.js');
const { setupDatabase, teardownDatabase } = require('../utils/dbSetup.js');

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(async () => {
  setupDatabase();
});

afterAll(async () => {
  teardownDatabase();
});

describe('Profile Routes', () => {
  let token;

  beforeEach(async () => {

    // Creating a user
    const hashedPassword = await hashPassword('password123');
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      userName: 'testUser',
    });
    profileId = user._id;

    token = await createSecretToken(
      user._id.toString(),
      process.env.JWT_SECRET
    );
  });

  afterEach(async () => {
    // Clear the users collection after each test
    await User.deleteMany({});

    // Logging out the user
    await request.post('/logout');
  });

  it('GET /userData - should get profile data successfully', async () => {
    const response = await request
      .get(`/profile/userData/${profileId}`)
      .set('Cookie', `token=${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('GET /userData - should fail to get profile data', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request
      .get(`/profile/userData/${nonExistentId}`)
      .set('Cookie', `token=${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it("POST / - should change the user's bio", async () => {
    const response = await request
      .post('/profile')
      .set('Cookie', `token=${token}`)
      .send({
        bio: 'This is a test',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Bio updated successfully');
  });

  it("POST / - should fail to change user's bio if the bio is longer than 200 characters", async () => {
    const response = await request
      .post('/profile')
      .set('Cookie', `token=${token}`)
      .send({
        bio: 'b'.repeat(201),
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'error',
      'A bio should not be longer than 200 characters'
    );
  });

  it('POST /block/:id - should block a user', async () => {
    const blockedUser = await User.create({
      email: 'test@beingBlocked.com',
      password: 'asdfasdf',
      userName: 'testUSerBlocked',
    });
    const response = await request
      .post(`/profile/block/${blockedUser._id}`)
      .set('Cookie', `token=${token}`)
      .send({
        block: true,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Block updated successfully'
    );
  });

  it('POST /block/:id - should fail if user is not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request
      .post(`/profile/block/${nonExistentId}`)
      .set('Cookie', `token=${token}`)
      .send({
        block: true,
      });
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
});
