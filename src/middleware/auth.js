const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { JWT_SECRET } = require("../config");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;
opts.passReqToCallback = true;

passport.use(
  new JwtStrategy(opts, async function (req, jwt_payload, done) {
    try {
      // Attach user info to request object
      req.user = jwt_payload.user;
      return done(null, jwt_payload.user);
    } catch (error) {
      done(error);
    }
  })
);

// SIGNUP STRATEGY
// This middleware saves the information provided by the user to the database,
// and then sends the user information to the next middleware if successful.
// Otherwise, it reports an error.
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { first_name, last_name } = req.body;
      try {
        const user = await UserModel.create({
          email,
          password,
          first_name,
          last_name,
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// LOGIN STRATEGY
// This middleware checks if the user exists in the database and if the password is correct.
// If both are correct, it sends the user information to the next middleware.
// Otherwise, it reports an error.
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.comparePassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);
