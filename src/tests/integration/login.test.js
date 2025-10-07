require("dotenv").config();
const request = require("supertest");
const { closeDb, connectDb } = require("../mockData/db");
const app = require("../../../app");
const User = require("../../models/User");
const { loginMockup, userMockup } = require("../mockData");

describe("POST /api/v1/user/login", () => {
  let user;

  beforeAll(async () => {
    // Connect to test DB
    await connectDb();
    // Create test user
    user = await User.create(userMockup);
  });

  afterAll(async () => await closeDb());

  it("should login a user successfully", async () => {
    const res = await request(app).post("/api/v1/user/login").send(loginMockup);

    expect(res.status).toBe(200);
    expect(res.body.hasError).toBe(false);

    expect(res.body.token).toBeDefined();
    expect(res.body.data.email).toBe("john@example.com");
    expect(res.body.data.first_name).toBe("John");
    expect(res.body.data.last_name).toBe("Doe");
  });

  it(" should return 400 for empty body", async () => {
    const res = await request(app).post("/api/v1/user/login").send({});

    expect(res.status).toBe(400);
    expect(res.body.hasError).toBe(true);
  });

  it(" should return 400 for wrong password", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send({ password: "different", email: "john@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username or password is incorrect");
    expect(res.body.hasError).toBe(true);
  });
});
