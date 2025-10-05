const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const MONGODB_URI = process.env.DB_URL;
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDb;
