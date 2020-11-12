import axios from "axios";

export default {
	getUser: id => {
		return axios.get("/api/users/" + id);
	},
	addUser: newUser => {
		return axios.post("/auth/signup", newUser);
	},
	logginUser: existingUser => {
		return axios.post("/api/users/login", existingUser);
	},

	//Events Calendar
	addAppointmentAdmin: (_id, newAppointment) => {
		return axios.post("/schedule/users/" + _id, newAppointment);
	},
	updateAppointmentAdmin: (_id, data) => {
		return axios.put("/schedule/calendar_events/" + _id, data);
	},
	deleteCalendarAdminEvent: _id => {
		return axios.delete("/schedule/calendar_events/" + _id);
	},
	getAppointmentsAdmin: _id => {
		return axios.get("/auth/users/" + _id);
	},
	getAppointmentAdmin: _id => {
		return axios.get("/schedule/calendar_events/" + _id);
	},
	getOneEventAdmin: _id => {
		return axios.get("/schedule/calendar_events/" + _id);
	},

	//Guests
	addGuest: (_id, newGuest) => {
		return axios.post("/guests/events/" + _id, newGuest);
	},
	getAllGuests: _id => {
		return axios.get("/guests/all");
	},
	getOneGuest: _id => {
		return axios.get("/guests/guest/" + _id);
	},
	updateOneGuest: (_id, data) => {
		return axios.put("/guests/guest/" + _id, data);
	},
	deleteOneGuest: _id => {
		return axios.delete("/guests/guest/" + _id);
	}
};
