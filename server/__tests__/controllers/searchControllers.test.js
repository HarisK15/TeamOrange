const {
  searchUsers,
  searchClucks,
  search,
} = require("../../controllers/searchControllers");
const User = require("../../models/user");
const Cluck = require("../../models/cluckModel");

jest.mock("../../models/user");
jest.mock("../../models/cluckModel");

describe("Search Controllers", () => {
  // Data used in multiple tests
  const mockUsers = [
    { _id: "1", userName: "User 1" },
    { _id: "2", userName: "User 2" },
  ];
  const mockClucks = [
    { _id: "1", text: "Cluck 1", user: { _id: "1", userName: "User 1" } },
  ];

  // Mock request and response objects used in multiple tests
  const req = { query: { q: "User" } };
  const res = { json: jest.fn(), status: jest.fn(() => res) };

  beforeEach(() => {
    jest.clearAllMocks();

    User.find.mockResolvedValue(mockUsers);
    Cluck.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockClucks),
    });
  });

  it("should return users matching the query", async () => {
    const users = await searchUsers("User");

    expect(users).toEqual(mockUsers);
  });

  it("should return clucks matching the query", async () => {
    const clucks = await searchClucks("Cluck");

    expect(clucks).toEqual(mockClucks);
  });

  it("should return users and clucks matching the query", async () => {
    await search(req, res);

    expect(res.json).toHaveBeenCalledWith({
      users: mockUsers,
      clucks: mockClucks,
    });
  });

  it("should handle errors", async () => {
    const errorMessage = "Error searching";
    User.find.mockRejectedValue(new Error(errorMessage));

    await search(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
