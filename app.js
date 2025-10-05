// const express = require("express");
// const app = express();

// // require("dotenv").config();
// const passport = require("passport");
// const { authRoute, articleRoute } = require("./src/routes");
// // const connectDb = require("./src/config/db");
// const { VERSION } = require("./src/config");

// app.use(express.json());

// // ----  Routes ----
// app.use("/user", authRoute);
// app.use(
//   `/${VERSION}/article`,
//   passport.authenticate("jwt", { session: false }),
//   articleRoute
// );

// // Error handler middleware
// app.use((err, req, res, next) => {
//   const message = err?.message || "Oops! Something went wrong";
//   return res.status(err.statusCode || 500).json({
//     hasError: true,
//     message,
//   });
// });

// module.exports = app;

const express = require("express");
const passport = require("passport");
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
    endpoints: {
      auth: `/${VERSION}/api/user`,
      blogs: `/${VERSION}/api/article`,
    },
  });
});
app.use(`/${VERSION}/api/user`, authRoute);

app.use(
  `/${VERSION}/api/article`,
  passport.authenticate("jwt", { session: false }),
  articleRoute
);

// Error handler middleware
app.use((err, req, res, next) => {
  const message = err?.message || "Oops! Something went wrong";
  return res.status(err.statusCode || 500).json({
    hasError: true,
    message,
  });
});

module.exports = app;
