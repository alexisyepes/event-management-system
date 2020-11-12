const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guestSchema = new Schema({
	name: { type: String, required: true },
	phone: { type: String },
	email: { type: String, required: true },
	confirmed: { type: String, required: false }
});

const Guest = mongoose.model("Guest", guestSchema);

module.exports = Guest;
