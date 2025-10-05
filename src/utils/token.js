const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

exports.generateToken = (user) => {
  const payload = { _id: user._id, email: user.email };
  //You store the id and email in the payload of the JWT.
  // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
  // DO NOT STORE PASSWORDS IN THE JWT!
  return jwt.sign({ user: payload }, JWT_SECRET, { expiresIn: "1h" });
};
