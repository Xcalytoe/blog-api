// jest.setup.js
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

jest.mock("passport", () => {
  return {
    use: jest.fn(),
    authenticate: jest.fn(() => (req, res, next) => next()), // always passes
    initialize: jest.fn(() => (req, res, next) => next()),
  };
});
