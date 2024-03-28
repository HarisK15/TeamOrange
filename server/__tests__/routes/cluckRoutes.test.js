require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const requestApp = request(app);
const mongoose = require('mongoose');
const User = require('../../models/user.js');
const Cluck = require('../../models/cluckModel.js');
const { hashPassword, createSecretToken } = require('../../helpers/auth.js');
const { setupDatabase, teardownDatabase } = require('../utils/dbSetup.js');

jest.setTimeout(60000); // allow time for MongoDB in-memory server to start

beforeAll(setupDatabase);
afterAll(teardownDatabase);

const createCluck = async (text, user) => {
  return await Cluck.create({ text, user, likedBy: [] });
};

const performRequest = async (method, url, token, body) => {
  const req = request(app)[method](url);
  if (token) {
    req.set('Cookie', `token=${token}`);
  }
  if (body) {
    req.send(body);
  }
  return await req;
};

const createUserAndToken = async (email, password, userName, blocked = []) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    userName,
    privacy: false,
    blocked,
  });
  const token = await createSecretToken(
    user._id.toString(),
    process.env.JWT_SECRET
  );
  return { user, token };
};

beforeEach(async () => {
  await User.deleteMany({});
  await Cluck.deleteMany({});

  const { user: newBlockedUser, token: newBlockedUserToken } =
    await createUserAndToken('test@test.blocked', 'password123', 'blockedUser');

  const { user: newUser, token: newToken } = await createUserAndToken(
    'test@test.test',
    'password123',
    'testUser',
    [newBlockedUser._id]
  );
  token = newToken;

  newCluck = await createCluck('This is part of a test!', newUser);
  await createCluck('This is part of a test by blocked!', newBlockedUser);
  newCluckId = newCluck._id;
  user = newUser;
  blockedUser = newBlockedUser;
  blockedUserToken = newBlockedUserToken;
});

describe('Cluck Routes', () => {
  it('POST / - should create a new cluck', async () => {
    const newCluck = { text: 'This is another test!' };
    const response = await performRequest('post', '/clucks', token, newCluck);
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(newCluck.text);
  });

  it('GET /:id - should respond with a single cluck', async () => {
    const response = await request(app).get(`/clucks/${newCluckId}`);
    expect(response.statusCode).toBe(200);
  });

  it('GET /:id - should respond with a 404 if the cluck is not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/clucks/${nonExistentId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Cluck not found');
  });

  it('DELETE /:id - should delete a cluck', async () => {
    const response = await performRequest(
      'delete',
      `/clucks/${newCluckId}`,
      token
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cluck deleted successfully');
  });

  it('DELETE /:id - should not delete a cluck if the user is not the author', async () => {
    const { token: token2 } = await createUserAndToken(
      'test2@test.test',
      'password123',
      'testUser2'
    );
    const response = await performRequest(
      'delete',
      `/clucks/${newCluckId}`,
      token2
    );
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('You can only delete your own clucks');
  });

  it('PATCH /:id - should edit a cluck', async () => {
    const updatedData = { text: 'This should be the updated text for a test!' };
    const response = await performRequest(
      'patch',
      `/clucks/${newCluckId}`,
      token,
      updatedData
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe(updatedData.text);
  });

  it('PATCH /:id - should not edit a cluck if the user is not the author', async () => {
    const { token: token2 } = await createUserAndToken(
      'test2@test.test',
      'password123',
      'testUser2'
    );
    const updatedData = { text: 'This should be the updated text for a test!' };
    const response = await performRequest(
      'patch',
      `/clucks/${newCluckId}`,
      token2,
      updatedData
    );
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('You can only edit your own clucks');
  });

  it('PATCH /like/:id - should like and unlike a cluck', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
    });

    const token2 = createSecretToken(user2._id);

    const response = await performRequest(
      'patch',
      `/clucks/like/${newCluckId}`,
      token2,
      { liked: true }
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.likedBy.length).toBe(1);

    const response2 = await performRequest(
      'patch',
      `/clucks/like/${newCluckId}`,
      token2,
      { liked: false }
    );
    expect(response2.statusCode).toBe(200);
    expect(response2.body.likedBy.length).toBe(0);
  });

  it('GET / - should get clucks whose authors have not blocked ', async () => {
    const response = await performRequest('get', `/clucks`, blockedUserToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body.filter((el) => el.user._id == user._id).length).toBe(
      0
    );
  });
  it('GET / - should get clucks whose authors have followed each other when privacy is on ', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
    });

    //Following each other
    await User.updateOne(
      { _id: user._id },
      {
        $set: { privacy: true, followers: [user2._id], following: [user2._id] },
      }
    );

    const user2Token = await createSecretToken(user2._id);

    const response = await performRequest('get', `/clucks`, user2Token);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body.filter((el) => el.user._id == user._id).length).toBe(
      1
    );

    //Not Following each other
    await User.updateOne(
      { _id: user._id },
      {
        $set: { following: [] },
      }
    );

    const response2 = await performRequest('get', `/clucks`, user2Token);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.length).toBe(1);
    expect(response2.body.filter((el) => el.user._id == user._id).length).toBe(
      0
    );

    //Not Following each other but have privacy disabled on author
    await User.updateOne(
      { _id: user._id },
      {
        $set: { privacy: false, following: [] },
      }
    );

    const response3 = await performRequest('get', `/clucks`, user2Token);
    expect(response3.statusCode).toBe(200);
    expect(response3.body.length).toBe(2);
    expect(response3.body.filter((el) => el.user._id == user._id).length).toBe(
      1
    );
  });

  it('GET /user/:id - should not get clucks by user who have blocked', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
    });

    //Author blocked the requesting user
    await User.updateOne(
      { _id: user._id },
      {
        $set: { blocked: [user2._id] },
      }
    );

    const user2Token = await createSecretToken(user2._id);

    const response = await performRequest(
      'get',
      `/clucks/user/${user._id}`,
      user2Token
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it('GET /user/:id - should not get clucks by user who have not followed each other if privacy is on by author', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
    });

    //Author enabled privacy and not following each other
    await User.updateOne(
      { _id: user._id },
      {
        $set: { privacy: true, following: [], followers: [] },
      }
    );

    const user2Token = await createSecretToken(user2._id);

    const response = await performRequest(
      'get',
      `/clucks/user/${user._id}`,
      user2Token
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it('GET /user/:id - should get clucks by user who have followed each other if privacy is on by author', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
      following: [user._id],
    });

    //Author enabled privacy and following each other
    await User.updateOne(
      { _id: user._id },
      {
        $set: { privacy: true, following: [user2._id], followers: [user2._id] },
      }
    );

    const user2Token = createSecretToken(user2._id);

    const response = await performRequest(
      'get',
      `/clucks/user/${user._id}`,
      user2Token
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('Post /replyCluck/:id - should reply to a cluck', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
    });

    const token2 = createSecretToken(user2._id);

    const response = await performRequest(
      'post',
      `/clucks/replyCluck/${newCluckId}`,
      token2,
      { text: 'test 3' }
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.replyTo.toString()).toBe(newCluckId.toString());
  });

  it('GET /clucks/replies/:cluckId', async () => {
    const user2 = await User.create({
      email: 'test2@test.com',
      password: await hashPassword('password123'),
      userName: 'testUser2',
    });
    const token2 = createSecretToken(user2._id);

    const cluck = await Cluck.create({
      text: 'Text to reply to.',
      user: user._id,
    });

    const cluckReply = await Cluck.create({
      text: 'Test reply 1',
      replyTo: cluck._id,
      user: user2._id,
    });

    await Cluck.updateOne({ _id: cluck._id }, { replies: [cluckReply._id] });

    const response = await performRequest(
      'get',
      `/clucks/replies/${cluck._id}`,
      token2
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
