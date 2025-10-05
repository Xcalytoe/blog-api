const Article = require("../models/Article");
const User = require("../models/User");
const calculateReadingTime = require("../utils/readingTime");

const getArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = "timestamp",
      order = "desc",
    } = req.query;

    const skip = (page - 1) * limit;

    // ===== BASE FILTER =====
    let filter = {};

    if (!req.user) {
      // Public users: only published
      filter.state = "published";
    } else {
      // Logged-in: published OR own drafts
      filter = {
        $or: [{ state: "published" }, { author: req.user._id }],
      };
    }
    // ===== SEARCH FILTER =====
    if (search) {
      const searchRegex = new RegExp(search, "i");

      // Find authors that match search text
      const authors = await User.find({
        $or: [
          { first_name: searchRegex },
          { last_name: searchRegex },
          { email: searchRegex },
        ],
      }).select("_id");

      const searchFilter = {
        $or: [
          { title: searchRegex },
          { tags: searchRegex },
          { author: { $in: authors.map((a) => a._id) } },
        ],
      };

      // Combine base + search filter with $and
      filter = { $and: [filter, searchFilter] };
    }

    // ===== SORTING =====
    const allowedSortFields = ["read_count", "reading_time", "timestamp"];
    const sortOptions = allowedSortFields.includes(sortBy)
      ? { [sortBy]: order === "asc" ? 1 : -1 }
      : { timestamp: -1 };

    // ===== FETCH =====
    const articles = await Article.find(filter)
      .populate("author", "first_name last_name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(filter);

    // ===== RESPONSE =====
    res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalArticles: total,
      results: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleArticle = async (req, res) => {};

const postArticle = async (req, res, next) => {
  try {
    if (!req.body) {
      const error = new Error("Missing article data");
      error.status = 400;
      next(error);
    }
    const { title, description, tags, body, state = "draft" } = req?.body || {};

    const reading_time = calculateReadingTime(body);

    const article = await Article.create({
      title,
      description,
      tags,
      body,
      author: req.user._id,
      reading_time,
      read_count: 0,
      state,
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res) => {};
const deleteArticle = async (req, res) => {};
const publishArticle = async (req, res) => {};
const unpublishedArticle = async (req, res) => {};

module.exports = {
  getArticles,
  getSingleArticle,
  postArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishedArticle,
};
