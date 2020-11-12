const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: String },
	password: { type: String },
	email: { type: String, required: true },
	events: [{ type: Schema.Types.ObjectId, ref: "Event" }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
