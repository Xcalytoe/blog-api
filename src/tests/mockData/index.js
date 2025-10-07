const userMockup = {
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  password: "Password123",
  confirmPassword: "Password123",
  _id: "64f0b2a4c0f1b0c123456789",
};
const signupMockup = {
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  password: "Password123",
};
const loginMockup = {
  email: "john@example.com",
  password: "Password123",
};
const articleMockup = {
  title: "My first article",
  description: "This is a description for test article",
  body: "This is the body of the article.",
  tags: ["test", "nodejs"],
  _id: "64f0b2a4c0f1b0653f456789",
  author: "64f0b2a4c0f1b0c123456789",
};

const passport = {
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => next()), // Mock authenticate if used
  initialize: jest.fn(),
  session: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
};

module.exports = {
  userMockup,
  articleMockup,
  loginMockup,
  passport,
  signupMockup,
};
