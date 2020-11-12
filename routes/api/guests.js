const express = require("express");
const router = express.Router();
const Guest = require("../../models/guests");
const Event = require("../../models/events");

//Get All guests
router.get("/all", (req, res) => {
	Guest.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.json(found);
		}
	});
});

//Get one Guest
router.get("/guest/:_id", (req, res) => {
	console.log(res);
	return Guest.findOne({
		_id: req.params._id
	}).then(function(dbGuest) {
		if (typeof dbGuest === "object") {
			res.json(dbGuest);
		}
	});
});

// PUT route for updating one Guest.
router.put("/guest/:_id", (req, res) => {
	Guest.findOneAndUpdate(
		{
			_id: req.body._id
		},
		{
			...req.body
		},
		{
			new: true
		}
	)
		.then(dbGuest => {
			res.json(dbGuest);
		})
		.catch(function(err) {
			reject(err);
		});
});

//Add a guest to an event
router.post("/events/:_id", function(req, res) {
	Guest.create(req.body)
		.then(function(dbGuest) {
			// console.log(dbGuest);
			return Event.findOneAndUpdate(
				{ _id: req.params._id },
				{
					$push: { guests: dbGuest }
				},
				{ new: true }
			);
		})
		.then(function(dbEvent) {
			res.json(dbEvent);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// DELETE route for Guests.
router.delete("/guest/:_id", function(req, res) {
	Guest.findOneAndRemove({
		_id: req.params._id
	}).then(function(dbGuest) {
		res.json(dbGuest);
	});
});

module.exports = router;
