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

describe("POST /api/v1/articles", () => {
  let token, user, article;

  beforeAll(async () => {
    // Connect to test DB
    await connectDb();
    // Create test user
    user = await User.create(userMockup);
    // Create JWT
    token = jwt.sign({ user: { _id: userMockup._id } }, JWT_SECRET);
    // Create test article
    article = await Article.create(articleMockup);
  });

  afterAll(async () => await closeDb());

  it("should create an article successfully", async () => {
    const res = await request(app)
      .post("/api/v1/articles")
      .set("Authorization", `Bearer ${token}`)
      .send(articleMockup);
    expect(res.status).toBe(201);
    expect(res.body.hasError).toBe(false);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        title: "My first article",
        body: "This is the body of the article.",
        author: "64f0b2a4c0f1b0c123456789",
        description: "This is a description for test article",
        tags: ["test", "nodejs"],
        state: "draft",
        reading_time: "1",
        read_count: 0,
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0,
      })
    );
  });

  it(" should return 400 for empty body", async () => {
    const res = await request(app)
      .post("/api/v1/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.hasError).toBe(true);
  });

  it("should return 401 when token is not present", async () => {
    const res = await request(app).post("/api/v1/articles").send(articleMockup);

    expect(res.status).toBe(401);
  });
});
