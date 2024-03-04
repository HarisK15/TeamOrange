const { changePassword } = require("../../controllers/passwordController");
const User = require("../../models/user");
const { hashPassword } = require("../../helpers/auth");

jest.mock("../../models/user");

const createMockReqRes = (currentPassword, newPassword) => ({
  req: {
    body: { currentPassword, newPassword },
  },
  res: {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  },
});

const createMockUser = async (password, saveReturnValue) => ({
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

describe("changePassword", () => {
  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const { req, res } = createMockReqRes("oldPassword", "newPassword");

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should return 400 if current password is incorrect", async () => {
    const mockUser = await createMockUser("oldPassword", false);
    User.findById.mockResolvedValue(mockUser);

    const { req, res } = createMockReqRes("wrongPassword", "newPassword");

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Current password is incorrect",
    });
  });

  it("should return 400 if new password is too short", async () => {
    const mockUser = await createMockUser("oldPassword", false);
    User.findById.mockResolvedValue(mockUser);

    const { req, res } = createMockReqRes("oldPassword", "new");

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "A new password is required and should be at least 6 characters long",
    });
  });

  it("should return 400 if new password is the same as the old password", async () => {
    const mockUser = await createMockUser("oldPassword", false);
    User.findById.mockResolvedValue(mockUser);

    const { req, res } = createMockReqRes("oldPassword", "oldPassword");

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error:
        "A new password is required and should be at least 6 characters long",
    });
  });

  it("should return 200 if password is updated successfully", async () => {
    const mockUser = await createMockUser("oldPassword", true);
    User.findById.mockResolvedValue(mockUser);

    const { req, res } = createMockReqRes("oldPassword", "newPassword");

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password updated successfully",
    });
  });

  it("should return 500 if an error occurs", async () => {
    User.findById.mockRejectedValue("error");

    const { req, res } = createMockReqRes("oldPassword", "newPassword");

    await changePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
