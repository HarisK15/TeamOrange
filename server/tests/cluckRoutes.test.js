const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose"); 
require("dotenv").config("../.env");

/* Connecting to the database before tests. */
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

/* Closing database connection after tests. */
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Cluck Routes", () => {
  let newCluckId;

  it("POST / - should create a new cluck", async () => {
    const newCluck = {
      text: "This is part of a test!",
    };
    const response = await request(app).post("/clucks").send(newCluck);
    expect(response.statusCode).toBe(200);
    newCluckId = response.body._id;
  });

  it("GET / - should respond with all clucks", async () => {
    const response = await request(app).get("/clucks");
    expect(response.statusCode).toBe(200);
  });

  it("GET /:id - should respond with a single cluck", async () => {
    const id = newCluckId;
    const response = await request(app).get(`/clucks/${id}`);
    expect(response.statusCode).toBe(200);
  });

  it("PATCH /:id - should edit a cluck", async () => {
    const id = newCluckId;
    const updatedData = {
      text: "This should be the updated text for a test!",
    };
    const response = await request(app)
      .patch(`/clucks/${id}`)
      .send(updatedData);
    expect(response.statusCode).toBe(200);
  });
});
