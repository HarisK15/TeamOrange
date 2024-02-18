const request = require('supertest');
const app = require('../../client/src/App.jsx');
const mongoose = require("mongoose");

beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});
  
afterEach(async () => {
    await mongoose.connection.close();
});

const userData = {
    email: 'user@example.com',
    currentPassword: 'oldPassword',
    newPassword: 'newPassword123',
};

const sendRequest = async ( data ) => {
    return request(app)
    .post('/change-password')
      .send(data)
      .set('Accept', 'application/json');
};

describe('Change Password API', () => {
    it('should change user password when provided with valid credentials', async () => {
        const response = await sendRequest( userData );
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Password updated successfully' });
    });

    it('should return an error when provided with an empty new password', async () => {
        const invalidUserData = {
            ...userData,
            newPassword: '',
        };
        
        const response = await sendRequest( userData );

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ success: true, message: 'A new password is required and should be at least 6 characters long' });
    });
});