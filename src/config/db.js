const mongoose = require("mongoose");
const CONFIG = require(".");

function connectMongoDb() {
  const url = CONFIG.DB_CONNECTION_URL;
  try {
    mongoose.connect(url).catch((error) => {
      console.log("mongoose:", error?.message);
    });
    mongoose.connection.on("connected", () => {
      console.log("DB Connected");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("DB disconnected");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Stop app if DB connection fails
  }
  mongoose.connection.on("error", (err) => {
    console.log("DB Error:" + err?.message);
  });
}
module.exports = connectMongoDb;
