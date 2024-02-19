const supertest = require('supertest');
const app = require('../index.js'); 
const request = supertest(app);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.js'); 
const {hashPassword, comparePassword} = require('../helpers/auth.js')


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
    
    // Creating a user
    const hashedPassword = await hashPassword('password123');
    await User.create({
        email: 'test@example.com',
        password: hashedPassword, 
        userName: 'testUser'
    });
});

describe('User Login', () => {
    it('should log in an existing user successfully', async () => {
        const response = await request
            .post('/login') 
            .send({
                email: 'test@example.com',
                password: 'password123',
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual('Password match'); 
    });

    it('should fail if the email does not exist', async () => {
        const response = await request
            .post('/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });
        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('error', 'No user found');
    });

    it('should fail if the password is incorrect', async () => {
        const response = await request
            .post('/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
        expect(response.statusCode).toBe(200); 
        expect(response.body).toHaveProperty('error', 'Passwords do not match');
    });
});