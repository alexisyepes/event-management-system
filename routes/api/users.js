const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");


//Signup route
router.post("/signup", (req, res) => {
	console.log(req.body);

	const { username, lastName, firstName, phone, email, password } = req.body;

	if (password.length < 6) {
		res.status(400).send({
			message: "Password must be at least 6 characters long!"
		});
	} else {
		User.findOne({
			email: email
		}).then(user => {
			if (user) {
				res.send({
					status: 400,
					message: "Email exists already! Try a different one"
				});
				return;
				// res.send("Email already exists!");
				// res.statusMessage = "Email already exists!";
				// res.status(400).end();
			} else {
				const encryptedPassword = bcrypt.hashSync(password, salt);

				let newUser = {
					username,
					lastName,
					firstName,
					phone,
					email,
					password: encryptedPassword
				};
				User.create(newUser)
					.then(() => {
						delete newUser.password;
						res.send(newUser);
					})
					.catch(function(err) {
						console.log(err);
						res.json(err);
					});
			}
		});
	}
});

//Login Route
router.post("/login", function(req, res, next) {
	const { email, password } = req.body;
	// generate the authenticate method and pass the req/res
	passport.authenticate("admin-local", function(err, user, info) {
		if (!email || !password) {
			return;
		}
		if (err) {
			return res.status(401).json(err);
		}
		if (!user) {
			return res.status(401).json(info);
		}
		// req / res held in closure
		req.logIn(user, () => {
			User.findOne({
				email: req.body.email
			})
				.populate("events")
				.then(user => {
					console.log(user)
					const token = jwt.sign(
						{ email: user.email },
						process.env.JWT_SECRET,
						{
							expiresIn: "1h"
						}
					);
					res.status(200).send({
						auth: true,
						token,
						message: "user found & logged in",
						user
					});
				})
				.catch(err => {
					res.json(err);
				});
		});
	})(req, res, next);
});

router.get(
	"/profile",
	passport.authenticate("jwt", {
		session: false
	}),
	(req, res) => {
		console.log(req.user);
		return res.json(req.user);
	}
);

/////for developing purposes...delete afterwards
// router.get("/users", (req, res) => {
// 	User.find({}, function(err, found) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.json(found);
// 		}
// 	});
// });

//Get one User
router.get("/users/:_id", (req, res) => {
	User.findOne({
		_id: req.params._id
	})
		.populate("events")
		.then(function(dbUser) {
			// if (typeof dbUser === "object") {
			// 	res.json(dbUser);
			// }
			res.json(dbUser);
		})
		.catch(function(err) {
			res.json(err);
		});
});

/////for developing purposes...delete afterwards

// Matches with "/api/users/:id"
// router
// 	.route("/:id")
// 	.get(usersController.findById)
// 	.put(usersController.update)
// 	.delete(usersController.remove);

module.exports = router;
