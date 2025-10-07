require("dotenv").config();
const request = require("supertest");
const { closeDb, connectDb, clearDb } = require("../mockData/db");
const app = require("../../../app");
const mongoose = require("mongoose");
const User = require("../../models/User");
const { JWT_SECRET } = require("../../config");
const Article = require("../../models/Article");
const jwt = require("jsonwebtoken");
const { userMockup, articleMockup } = require("../mockData");

jest.setTimeout(20000); // 20 seconds

describe("PATCH /api/v1/articles/:id", () => {
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

  it("should update an article successfully", async () => {
    const res = await request(app)
      .patch(`/api/v1/articles/${article._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        description: "Updated description",
      });

    expect(res.status).toBe(200);
    expect(res.body.hasError).toBe(false);
    expect(res.body.data.title).toBe("Updated Title");
  });

  it(" should return 400 for empty body", async () => {
    const res = await request(app)
      .patch(`/api/v1/articles/${article._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.hasError).toBe(true);
  });

  it(" should return 404 if article does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/v1/articles/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Title" });

    expect(res.status).toBe(404);
    expect(res.body.hasError).toBe(true);
  });

  it("should return 403 if user is not the author", async () => {
    // Create another user
    const otherUser = await User.create({
      email: "other@example.com",
      password: "Password123!",
      first_name: "Other",
      last_name: "User",
    });

    const otherToken = jwt.sign({ user: { _id: otherUser._id } }, JWT_SECRET);

    const res = await request(app)
      .patch(`/api/v1/articles/${article._id}`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ title: "Unauthorized Update" });

    expect(res.status).toBe(403); // Forbidden (since user is not the author)
    expect(res.body.hasError).toBe(true);
  });
});
