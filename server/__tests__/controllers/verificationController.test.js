const { verifyEmail } = require('../../controllers/verificationController');
const User = require('../../models/user');
const { hashPassword } = require('../../helpers/auth');
const mongoose = require('mongoose');

jest.mock('../../models/user');

const createMockVerifyEmailReqRes = (verificationToken) => ({
  req: {
    params: { verificationToken: verificationToken },
  },
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  },
});

const createMockUser = async (password, saveReturnValue) => ({
  _id: new mongoose.Types.ObjectId(),
  bio: 'hi there',
  userName: 'JohnDoe',
  email: 'johnDoe@hotmail.com',
  password: await hashPassword(password),
  save: jest.fn().mockResolvedValue(saveReturnValue),
});

describe('verifyEmail', () => {
  
  it('should verify an email successfully', async () => {
    const user = await createMockUser('password123', true);
    User.findOne.mockResolvedValue(user);
    const verificationToken = 'validToken';

    const { req, res } = createMockVerifyEmailReqRes(verificationToken);

    await verifyEmail(req, res);

    expect(user.isVerified).toBe(true);
    expect(user.verificationToken).toBeNull();
    expect(user.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Email verification successful' });
  });
  
  it('should return a 404 error if the user is not found', async () => {
    User.findOne.mockResolvedValue(null);
    const nonExistentVerificationToken = 'nonExistentToken';

    const { req, res } = createMockVerifyEmailReqRes(nonExistentVerificationToken);

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid verification token' });
  });

  it('should raise an internal server error', async () => {
    User.findOne.mockRejectedValue(new Error('Some error occurred'));

    const { req, res } = createMockVerifyEmailReqRes('anyToken');

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});