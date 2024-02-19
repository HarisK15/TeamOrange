const supertest = require('supertest');
const app = require('../index.js'); 
const request = supertest(app);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.js'); 

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
  // Clear the users collection before each test
  await User.deleteMany({});
});

describe('User Registration', () => {
  it('should register a user successfully', async () => {
    const res = await request
    .post('/register')
    .send({
      userName: 'testUser',
      email: 'test@example.com',
      password: '123456'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should fail if username is not provided', async () => {
    const res = await request.post('/register').send({
      email: 'test@example.com',
      password: '123456'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error', 'User Name is required');
  });

  it('should fail if password is too short', async () => {
    const res = await request.post('/register').send({
      userName: 'testUser',
      email: 'test@example.com',
      password: '123'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error', 'Password is required and should be at least 6 characters long');
  });

  it('should fail if email is already taken', async () => {
    // First, create a user to simulate the "already taken" scenario
    await User.create({
      userName: 'existingUser',
      email: 'existing@example.com',
      password: '123456'
    });

    // Then, try to register another user with the same email
    const res = await request.post('/register').send({
      userName: 'testUser',
      email: 'existing@example.com',
      password: '123456'
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('error', 'Email is already taken');
  });
});
