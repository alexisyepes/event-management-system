const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const routes = require("./routes");
const usersRouter = require("./routes/api/users");
const calendarEvents = require("./routes/api/calendarEvents");
const guests = require("./routes/api/guests");
const path = require("path");

app.use(cors());
// Passport Config
require("./passport/passport")(passport);

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.json());

//Passport Config
app.use(passport.initialize());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use("/auth", usersRouter);
app.use("/schedule", calendarEvents);
app.use("/guests", guests);
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(
  `mongodb+srv://event_management_app:${process.env.MONGO_ATLAS}@cluster0.taku8.mongodb.net/event_management_app?retryWrites=true&w=majority`,

  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
