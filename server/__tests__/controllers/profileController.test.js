const { getProfileData, changeBio } = require("../../controllers/profileController");
const User = require("../../models/user");
const { hashPassword } = require("../../helpers/auth");
const mongoose = require("mongoose");

jest.mock("../../models/user");

const createMockChangeBioReqRes = (bio) => ({
  req: {
    body: { bio },
  },
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  },
});

const createMockProfileDataReqRes = (profileId) => ({
    req: {
      params: { profileId: profileId },
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

// These hooks suppress console.error output during tests to keep the test output clean
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  console.error.mockRestore();
});

describe("getProfileData", () => {
    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
      const nonExistentId = new mongoose.Types.ObjectId();
  
      const { req, res } = createMockProfileDataReqRes(nonExistentId);
  
      await getProfileData(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  
    it("should return 200 if profile data is retrieved successfully", async () => {
      const mockUser = await createMockUser("oldPassword", true);
      User.findById.mockResolvedValue(mockUser);
  
      const { req, res } = createMockProfileDataReqRes(mockUser._id);
  
      await getProfileData(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
    });
  
    it("should return 500 if an error occurs", async () => {
      User.findById.mockRejectedValue("error");
  
      const { req, res } = createMockProfileDataReqRes("fn68487ef527bgk0");
  
      await getProfileData(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
});

describe("changeBio", () => {
    it("should return 404 if user not found", async () => {
      User.findById.mockResolvedValue(null);
  
      const { req, res } = createMockChangeBioReqRes("hi this is my bio");
  
      await changeBio(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  
    it("should return 200 if bio is updated successfully", async () => {
      const mockUser = await createMockUser("oldPassword", true);
      User.findById.mockResolvedValue(mockUser);
  
      const { req, res } = createMockChangeBioReqRes("hi this is my bio");
  
      await changeBio(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Bio updated successfully",
      });
    });
  
    it("should return 500 if an error occurs", async () => {
      User.findById.mockRejectedValue("error");
  
      const { req, res } = createMockChangeBioReqRes("hi this is my bio");
  
      await changeBio(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });

    it("should return 400 if bio is longer than 200 characters", async () => {
      const mockUser = await createMockUser("oldPassword", true);
      User.findById.mockResolvedValue(mockUser);
  
      const { req, res } = createMockChangeBioReqRes("b".repeat(201));
  
      await changeBio(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "A bio should not be longer than 200 characters" });
      });
});