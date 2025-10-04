const authRoute = require("express").Router();
const { login, createUser } = require("../controllers/authControllers");

authRoute.post("/create", createUser);
authRoute.post("/login", login);

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
