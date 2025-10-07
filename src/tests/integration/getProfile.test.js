require("dotenv").config();
const request = require("supertest");
const { closeDb, connectDb } = require("../mockData/db");
const app = require("../../../app");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../config");
const Article = require("../../models/Article");
const jwt = require("jsonwebtoken");
const { userMockup, articleMockup } = require("../mockData");

jest.setTimeout(20000); // 20 seconds

describe("GET /api/v1/user/me", () => {
  let token, user;

  beforeAll(async () => {
    // Connect to test DB
    await connectDb();
    // Create test user
    user = await User.create(userMockup);
    // Create JWT
    token = jwt.sign({ user: { _id: userMockup._id } }, JWT_SECRET);
  });

  afterAll(async () => await closeDb());

  it("should get user profile successfully", async () => {
    const res = await request(app)
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.hasError).toBe(false);
    expect(res.body.data).toEqual(expect.objectContaining(userMockup));
  });

  it("should return 401 when token is not present", async () => {
    const res = await request(app).get("/api/v1/user/me");

    expect(res.status).toBe(401);
  });
});
