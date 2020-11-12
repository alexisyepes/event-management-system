const express = require("express");
const router = express.Router();
const Event = require("../../models/events");
const User = require("../../models/user");

//Get All Appointments Admin
router.get("/calendar_events", (req, res) => {
	Event.find({}, function(err, found) {
		if (err) {
			console.log(err);
		} else {
			res.json(found);
		}
	});
});

//Get one Appointment Admin
router.get("/calendar_events/:_id", (req, res) => {
	console.log(res);
	// console.log(res)
	return Event.findOne({
		_id: req.params._id
	})
		.populate("guests")
		.then(function(dbCalendar) {
			if (typeof dbCalendar === "object") {
				res.json(dbCalendar);
			}
		})
		.catch(function(err) {
			reject(err);
		});;
});

// PUT route for updating one Calendar Event.
router.put("/calendar_events/:_id", (req, res) => {
	Event.findOneAndUpdate(
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
		.then(dbCalendar => {
			res.json(dbCalendar);
		})
		.catch(function(err) {
			reject(err);
		});
});

//Add an Event Admin
router.post("/users/:_id", function(req, res) {
	Event.create(req.body)
		.then(function(dbEvent) {
			// console.log(dbEvent);
			return User.findOneAndUpdate(
				{ _id: req.params._id },
				{
					$push: { events: dbEvent._id }
				},
				{ new: true }
			);
		})
		.then(function(dbUser) {
			res.json(dbUser);
		})
		.catch(function(err) {
			res.json(err);
		});
});

// DELETE route for events Admin Calendar.
router.delete("/calendar_events/:_id", function(req, res) {
	Event.findOneAndRemove({
		_id: req.params._id
	})
		.then(function(dbCalendar) {
			res.json(dbCalendar);
		})
		.catch(function(err) {
			reject(err);
		});
});

module.exports = router;
