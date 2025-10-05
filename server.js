require("dotenv").config();
const app = require("./app");
const connectDb = require("./src/config/db"); // Assuming the database connection logic is in this file.

const PORT = process.env.PORT || 3000;

// Connect to the database and then start the server
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app; // Export the app for testing purposes
