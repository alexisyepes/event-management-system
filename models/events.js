const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
	title: { type: String, required: true },
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	appointment: { type: String, required: true },
	guests: [{ type: Schema.Types.ObjectId, ref: "Guest" }]
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
