const mongoose = require("mongoose");

// title, description, tags, author, timestamp, state, read_count, reading_time and body
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    state: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    reading_time: {
      type: String,
    },
    read_count: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
