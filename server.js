require("dotenv").config();

const mongoose = require("mongoose");

// const express = require("express");

// const CONFIG = require("./src/config");
const app = require("./app");
// const connectDB = require("./src/config/db");

// const passport = require("passport");
// const { authRoute, articleRoute } = require("./src/routes");
// const connectDb = require("./src/config/db");
// const server = express();
// const { PORT } = require("./src/config");
const MONGODB_URI = process.env.DB_URL;
const PORT = process.env.PORT;

// server.use(express.json());

// Connect DB
// connectDb();

// passport-jwt middleware
// require("./src/middleware/auth");

// // ----  Routes ----
// server.use("/user", authRoute);
// server.use(
//   `/${VERSION}/article`,
//   passport.authenticate("jwt", { session: false }),
//   articleRoute
// );

// // Error handler middleware
// server.use((err, req, res, next) => {
//   const message = err?.message || "Oops! Something went wrong";
//   return res.status(err.statusCode || 500).json({
//     hasError: true,
//     message,
//   });
// });

// (async () => {
//   const MONGODB_URI = CONFIG.DB_CONNECTION_URL;

//   await connectDB(MONGODB_URI);
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// })();
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// server.listen(PORT, () => console.log(`Server has started in port ${PORT}`));

// module.exports = app;
