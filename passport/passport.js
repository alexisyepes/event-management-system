// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const User = require("../models/user");
// const jwtSecret = require('./secret');
// const jwtSecret = process.env.JWT_SECRET;
require("dotenv").config();

// const salt = bcrypt.genSaltSync(10);

module.exports = function(passport) {
	passport.use(
		"admin-local",
		new LocalStrategy(
			// Our user will sign in using an email, rather than a "username"
			{
				usernameField: "email"
			},
			function(email, password, done) {
				// When a user tries to sign in this code runs
				User.findOne({
					email: email
				}).then(user => {
					if (!user || !user.password) {
						return done(null, false, {
							message: "No user found under those credentials"
						});
					}
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;

						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, {
								message: "Email or Password not valid"
							});
						}
					});
				});
			}
		)
	);

	const opts = {
		jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
		secretOrKey: process.env.JWT_SECRET
	};

	passport.use(
		"jwt",
		new JWTstrategy(opts, (jwt_payload, done) => {
			try {
				User.findOne({
					email: jwt_payload.email
				}).then(user => {
					if (user) {
						console.log("User found in db in passport");
						done(null, user);
					} else {
						console.log("user not found in db");
						done(null, false);
					}
				});
			} catch (err) {
				done(err);
			}
		})
	);
};
