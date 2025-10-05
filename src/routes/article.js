const passport = require("passport");
const articleRoute = require("express").Router();
const optionalAuth = require("../middleware/optionalAuth");
const {
  getArticles,
  getSingleArticle,
  postArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishedArticle,
} = require("../controllers/articleControllers");

// Public routes
articleRoute.get("/", optionalAuth, getArticles);
articleRoute.get("/:id", getSingleArticle);

// Protected routes
articleRoute.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postArticle
);

articleRoute.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateArticle
);
articleRoute.put(
  "/:id/publish",
  passport.authenticate("jwt", { session: false }),
  publishArticle
);
articleRoute.put(
  "/:id/draft",
  passport.authenticate("jwt", { session: false }),
  unpublishedArticle
);
articleRoute.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteArticle
);

module.exports = articleRoute;
