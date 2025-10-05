const mongoose = require("mongoose");

// title, description, tags, author, timestamp, state, read_count, reading_time and body
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    body: {
      type: String,
      required: [true, "Post body is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    tags: {
      type: [String],
      required: [true, "Tag is required"],
      default: [],
    },
    state: {
      type: String,
      enum: ["draft", "published"],
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
const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
