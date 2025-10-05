const passport = require("passport");

module.exports = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) req.user = user; // attach user only if valid
    next(); // always continue, even if no user
  })(req, res, next);
};
