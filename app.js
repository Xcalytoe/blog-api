const express = require("express");
const app = express();

// require("dotenv").config();
// const passport = require("passport");
// const { authRoute, articleRoute } = require("./src/routes");
// const connectDb = require("./src/config/db");
// const { VERSION } = require("./src/config");

app.use(express.json());

// ----  Routes ----
// app.use("/user", authRoute);
// app.use(
//   `/${VERSION}/article`,
//   passport.authenticate("jwt", { session: false }),
//   articleRoute
// );

// Error handler middleware
app.use((err, req, res, next) => {
  const message = err?.message || "Oops! Something went wrong";
  return res.status(err.statusCode || 500).json({
    hasError: true,
    message,
  });
});

module.exports = app;
