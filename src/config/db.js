const mongoose = require("mongoose");
const CONFIG = require(".");

async function connectDB(url) {
  // const url = CONFIG.DB_CONNECTION_URL;
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log("mongoose:", error?.message);
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("DB disconnected");
  });
  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.log("DB Error:" + err?.message);
  });
}
module.exports = connectDB;
