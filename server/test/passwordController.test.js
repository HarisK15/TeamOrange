const app = require('../index.js'); 
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/user.js'); 
const { hashPassword } = require('../helpers/auth.js')
const { mockRequest, mockResponse } = require('jest-express');
const { changePassword } = require('../controller/passwordController.js');


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

const userData = {
    currentPassword: 'password123',
    newPassword: 'Password123'
}

describe('Change Password API', () => {
    it('should change user password when provided with valid credentials', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.session.userEmail = 'test@example.com';
        req.body = {
            ...userData
        };
        await changePassword(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(res.json).toEqual({ success: true, message: 'Password updated successfully' });
    });

    it('should return error 400 when provided with an empty new password', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.session.userEmail = 'test@example.com';
        req.body = {
            ...userData,
            newPassword: ''
        };
        await changePassword(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.json).toEqual({ success: false, message: 'A new password is required and should be at least 6 characters long' });
    });

    it('should return error 400 when provided with a password shorter than 6', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.session.userEmail = 'test@example.com';
        req.body = {
            ...userData,
            newPassword: 'short'
        };
        await changePassword(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.json).toEqual({ success: false, message: 'A new password is required and should be at least 6 characters long' });
    });

    it('should return error 404 when an email provided is not valid', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.body = {
            ...userData,
        };
        await changePassword(req, res);

        expect(res.statusCode).toBe(404);
        expect(res.json).toEqual({ success: false, message: 'User not found' });
    });

    it('should return error 400 when provided with a current password and new password that are equal to eachother', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.session.userEmail = 'test@example.com';
        req.body = {
            ...userData,
            newPassword: 'password123'
        };
        await changePassword(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.json).toEqual({ success: false, message: 'A new password is required and should be at least 6 characters long' });
    });

    it('should return error 400 when provided with a current password that does not match their password in the database', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.session.userEmail = 'test@example.com';
        req.body = {
            ...userData,
            currentPassword: 'Password123'
        };
        await changePassword(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.json).toEqual({ success: false, message: 'Current password is incorrect' });
    });

    it('should return error 400 when provided with a current password that is empty', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.session.userEmail = 'test@example.com';
        req.body = {
            ...userData,
            currentPassword: ''
        };
        await changePassword(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.json).toEqual({ success: false, message: 'Current password is incorrect' });
    });
});