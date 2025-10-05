const express = require("express");
const { authRoute, articleRoute } = require("./src/routes");
const { VERSION } = require("./src/config");

const app = express();

// Middleware
app.use(express.json());

// passport-jwt middleware (make sure to require and set this up properly)
require("./src/middleware/auth");

// Routes
app.get("/", (_, res) => {
  res.status(200).json({
    message: "Welcome to the Blog API",
    version: "1.0",
    documentation: "https://github.com/Xcalytoe/blog-api",
    endpoints: {
      auth: `/api/${VERSION}/user`,
      blogs: `/api/${VERSION}/articles`,
    },
  });
});
app.use(`/api/${VERSION}/user`, authRoute);
app.use(`/api/${VERSION}/articles`, articleRoute);

//  Handle 404 (route not found)
app.use((req, res, next) => {
  res.status(404).json({
    hasError: true,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  const message = err?.message || "Oops! Something went wrong";
  return res.status(err.statusCode || 500).json({
    hasError: true,
    message,
  });
});

module.exports = app;
