const passport = require("passport");
const authRoute = require("express").Router();
const {
  login,
  createUser,
  getProfile,
  getUserArticles,
} = require("../controllers/authControllers");

authRoute.post("/create", createUser);
authRoute.post("/login", login);

authRoute.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  getProfile
);
authRoute.get(
  "/me/articles",
  passport.authenticate("jwt", { session: false }),
  getUserArticles
);

// authRoute.get("/logout", (req, res) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     // Add the token to the blacklist
//     add(token);
//   }
//   res.clearCookie("jwt");
//   res.redirect("/login");
// });

module.exports = authRoute;
