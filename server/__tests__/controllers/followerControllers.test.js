const User = require("../../models/user");
const mongoose = require("mongoose");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../../controllers/followerControllers");

jest.mock("../../models/user", () => ({
  findById: jest.fn(),
}));
jest.mock("mongoose");

describe("Follower Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("followUser", () => {
    it("should follow a user successfully", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce({
        followers: [],
        save: jest.fn(),
      });
      User.findById.mockResolvedValueOnce({
        following: [],
        save: jest.fn(),
      });

      await followUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User followed successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await followUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 if user to follow is not found", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce(null);

      await followUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 400 if user is already followed", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce({
        followers: ["456"],
      });
      User.findById.mockResolvedValueOnce({
        following: ["123"],
      });

      await followUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "You are already following this user",
      });
    });

    it("should return 500 if an unexpected error occurs", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockRejectedValue(new Error("Error following user"));

      await followUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("unfollowUser", () => {
    it("should unfollow a user successfully", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce({
        followers: ["456"],
        save: jest.fn(),
      });
      User.findById.mockResolvedValueOnce({
        following: ["123"],
        save: jest.fn(),
      });

      await unfollowUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User unfollowed successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await unfollowUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 if user to unfollow is not found", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce(null);

      await unfollowUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 400 if user is not followed", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce({
        followers: [],
      });
      User.findById.mockResolvedValueOnce({
        following: [],
      });

      await unfollowUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "You are not following this user",
      });
    });

    it("should return 500 if an unexpected error occurs", async () => {
      const mockReq = {
        params: { id: "123" },
        userId: "456",
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockRejectedValue(new Error("Error unfollowing user"));

      await unfollowUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("getFollowers", () => {
    it("should return followers successfully", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const user = { _id: 123, name: "John Doe" };
      const populatedUser = { ...user, followers: ["follower1", "follower2"] };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValue(user);
      user.populate = jest.fn().mockReturnThis();
      user.execPopulate = jest.fn().mockResolvedValue(populatedUser);

      await getFollowers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(["follower1", "follower2"]);
    });

    it("should return 404 if user not found", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await getFollowers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 if user to get followers for is not found", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValueOnce(null);

      await getFollowers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 if an unexpected error occurs", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockRejectedValue(new Error("Error getting followers"));

      await getFollowers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("getFollowing", () => {
    it("should return following successfully", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = { _id: 123, name: "John Doe" };
      const populatedUser = {
        ...user,
        following: ["following1", "following2"],
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      User.findById.mockResolvedValue(user);
      user.populate = jest.fn().mockReturnThis();
      user.execPopulate = jest.fn().mockResolvedValue(populatedUser);

      await getFollowing(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(["following1", "following2"]);
    });

    it("should return 404 if user not found", async () => {
      const mockReq = { params: { id: "123" } };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await getFollowing(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  it("should return 404 if user to get following for is not found", async () => {
    const mockReq = { params: { id: "123" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongoose.Types.ObjectId.isValid.mockReturnValue(true);
    User.findById.mockResolvedValueOnce(null);

    await getFollowing(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should return 500 if an unexpected error occurs", async () => {
    const mockReq = { params: { id: "123" } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mongoose.Types.ObjectId.isValid.mockReturnValue(true);
    User.findById.mockRejectedValue(new Error("Error getting following"));

    await getFollowing(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Server error" });
  });
});
