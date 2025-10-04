const passport = require("passport");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const login = (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        //You store the id and email in the payload of the JWT.
        // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
        // DO NOT STORE PASSWORDS IN THE JWT!
        const token = jwt.sign({ user: body }, JWT_SECRET, {
          expiresIn: "1h",
        });

        // 🔑 Save token in a cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: false,
          sameSite: "Strict",
          maxAge: 3600000,
        }); // 1 hour

        // Return success
        return res.status(200).json({
          hasError: false,
          data: token,
          message: "Logged in successfully",
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const createUser = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
      hasError: true,
    });
  }
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(400).json({ message: info.message, hasError: true });

    res.json({
      message: "Signup successful",
      hasError: false,
      user,
    });
  })(req, res, next);
};

module.exports = { login, createUser };
