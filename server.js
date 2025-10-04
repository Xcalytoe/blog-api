const express = require("express");
require("dotenv").config();
const passport = require("passport");
const { authRoute, articleRoute } = require("./src/routes");
const connectDb = require("./src/config/db");
const server = express();
const { PORT, VERSION } = require("./src/config");

server.use(express.json());

// Connect DB
connectDb();

// passport-jwt middleware
// require("./src/middleware/auth");

// ----  Routes ----
server.use("/user", authRoute);
server.use(
  `/${VERSION}/article`,
  passport.authenticate("jwt", { session: false }),
  articleRoute
);

// Error handler middleware
server.use((err, req, res, next) => {
  const message = err?.message || "Oops! Something went wrong";
  return res.status(err.statusCode || 500).json({
    hasError: true,
    message,
  });
});

server.listen(PORT, () => console.log(`Server has started in port ${PORT}`));

module.exports = server;
