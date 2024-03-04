const { userVerification } = require("../../middleware/verifyUser");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");
jest.mock("../../models/user");

describe("userVerification", () => {
  it("should return 401 if no token is provided", async () => {
    const req = { cookies: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();

    await userVerification(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ isLoggedIn: false });
  });

  it("should return 401 if token is invalid or user not found", async () => {
    jwt.verify.mockImplementation(() => ({ id: "1" }));
    User.findById.mockResolvedValue(null);

    const req = { cookies: { token: "token" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();

    await userVerification(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: false });
  });

  it("should call next if token is valid and user found", async () => {
    jwt.verify.mockImplementation(() => ({ id: "1" }));
    User.findById.mockResolvedValue({ _id: "1" });

    const req = { cookies: { token: "token" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();

    await userVerification(req, res, next);

    expect(req.userId).toEqual("1");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if jwt.verify throws an error", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error();
    });

    const req = { cookies: { token: "token" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();

    await userVerification(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: false });
  });
});
