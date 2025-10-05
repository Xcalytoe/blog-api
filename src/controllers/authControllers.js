const passport = require("passport");
const { generateToken } = require("../utils/token");
const Article = require("../models/Article");
const pagination = require("../utils/pagination");
const UserModel = require("../models/User");

const login = (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      console.log(user);

      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // Generate JWT
        const token = generateToken(user);

        // Return success
        return res.status(200).json({
          hasError: false,
          message: "Logged in successfully",
          token,
          data: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const createUser = (req, res, next) => {
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(400).json({ message: info.message, hasError: true });

    const { email, first_name, last_name } = user;
    res.json({
      message: "Signup successful",
      hasError: false,
      data: {
        email,
        first_name,
        last_name,
      },
    });
  })(req, res, next);
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await UserModel.findById(userId);
    const { email, first_name, last_name } = profile;

    res.status(200).json({
      message: "User profile",
      data: {
        email,
        first_name,
        last_name,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user articles",
      error: err.message,
    });
  }
};

const getUserArticles = async (req, res) => {
  try {
    const { page = 1, state, limit = 20 } = req.query || {};
    const userId = req.user._id;
    let filter = {};
    if (typeof page === "number") {
      filter.page = page;
    }
    if (state) {
      filter.state = { $regex: state, $options: "i" };
    }
    if (typeof limit === "number") {
      filter.limit = limit;
    }

    const articlesData = await pagination(Article, {
      author: userId,
      ...filter,
    });
    res.status(200).json({
      message: "User articles",
      ...articlesData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user articles",
      error: err.message,
    });
  }
};
module.exports = { login, createUser, getProfile, getUserArticles };
