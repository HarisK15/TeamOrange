const request = require('supertest');
const app = require('../../app.js');
const User = require('../../models/user.js');
const { setupDatabase, teardownDatabase } = require('../utils/dbSetup.js');
const { hashPassword } = require('../../helpers/auth');

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(async () => {
  setupDatabase();
});

afterAll(async () => {
  teardownDatabase();
});

describe('Email Verification Routes', () => {
  let verificationToken;

  beforeEach(async () => {
    // Create a user with a verification token
    const user = await User.create({
      email: 'test@example.com',
      verificationToken: 'validToken',
      userName: 'JohnDoe',
      password: await hashPassword("password"),
    });
    verificationToken = user.verificationToken;
  });

  afterEach(async () => {
    // Clear the users collection after each test
    await User.deleteMany({});
  });

  it('GET /:verificationToken - should verify the email successfully', async () => {
    const response = await request(app)
      .get(`/verify-email/${verificationToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Email verification successful' });
  });

  it('GET /:verificationToken - should return the 404 error for an invalid token', async () => {
    const response = await request(app)
      .get(`/verify-email/invalidToken`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Invalid verification token' });
  });

  it('GET /:verificationToken - should raise an internal server error', async () => {
    User.findOne = jest.fn().mockRejectedValue(new Error('Internal Server Error'));

    const response = await request(app)
      .get(`/verify-email/${verificationToken}`)
      .send();
  
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});