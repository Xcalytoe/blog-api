const Article = require("../models/Article");
const User = require("../models/User");
const calculateReadingTime = require("../utils/readingTime");
const pagination = require("../utils/pagination");

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
    const articles = await pagination(Article, filter, {
      limit,
      skip,
      sort: sortOptions,
      page,
      populate: { path: "author", select: "first_name last_name email" },
    });

    const total = await Article.countDocuments(filter);

    // ===== RESPONSE =====
    res.status(200).json({
      hasError: false,
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

const getSingleArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id).populate(
      "author",
      "first_name last_name email"
    );

    if (!article) {
      return res.status(404).json({
        hasError: true,
        message: "Article not found",
      });
    }

    //  only the owner can view draft
    if (
      article.state === "draft" &&
      (!req.user || req.user._id.toString() !== article.author._id.toString())
    ) {
      return res.status(403).json({
        hasError: true,
        message: "You are not authorized to view this draft",
      });
    }

    // Increment read_count only for published articles
    if (article.state === "published") {
      article.read_count += 1;
      await article.save();
    }

    res.status(200).json({
      message: "Blog retrieved successfully",
      hasError: false,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

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

    res.status(201).json({ hasError: false, data: article });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        hasError: true,
        message: "Missing article data",
      });
    }
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        hasError: true,
        message: "Article not found",
      });
    }
    // Check if user is the owner
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        hasError: true,
        message: "You are not authorized to publish this article",
      });
    }

    const updateArticle = await Article.findOneAndUpdate(
      {
        _id: id,
        author: req.user._id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Blog updated successfully",
      hasError: false,
      data: updateArticle,
    });
  } catch (err) {
    next(err);
  }
};
const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        hasError: true,
        message: "Article not found",
      });
    }
    // Check if user is the owner
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        hasError: true,
        message: "You are not authorized to delete this article",
      });
    }
    await Article.findByIdAndDelete(id);

    res.status(200).json({
      message: "Article deleted successfully",
      hasError: false,
    });
  } catch (error) {
    next(error);
  }
};
const publishArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        hasError: true,
        message: "Article not found",
      });
    }
    // Check if user is the owner
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        hasError: true,
        message: "You are not authorized to publish this article",
      });
    }

    // Check if article is already published
    if (article.state === "published") {
      return res.status(400).json({
        hasError: true,
        message: "Article is already published and cannot be updated",
      });
    }
    article.state = "published";
    await article.save();
    res.status(200).json({
      message: "Blog published successfully",
      hasError: false,
      data: article,
    });
  } catch (err) {
    next(err);
  }
};
const unpublishedArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        hasError: true,
        message: "Article not found",
      });
    }
    // Check if user is the owner
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        hasError: true,
        message: "You are not authorized to publish this article",
      });
    }

    // Check if article is already unpublished
    if (article.state === "draft") {
      return res.status(400).json({
        hasError: true,
        message: "Article is already unpublished and cannot be updated",
      });
    }
    article.state = "draft";
    await article.save();

    res.status(200).json({
      message: "Blog unpublished successfully",
      hasError: false,
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticles,
  getSingleArticle,
  postArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishedArticle,
};
