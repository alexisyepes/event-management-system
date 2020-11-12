import React, { Component } from "react";
import { Button } from "reactstrap";
import "./style.css";

class index extends Component {
  render() {
    return (
      <div>
        <div className="container homeContainer">
          <div className="row homeMainBox">
            <div className="col-xl-12">
              <h4 className="homeTitleWelcome">
                Welcome to My Events Management App
              </h4>
              <p className="homeParagraph">
                This app will help you organize your schedule in a better way.
                You can create events to be added to your own personal account,
                and add guests to those events.
                <br />
                Using a calendar to select the desired dates and times, you will
                manage your appointments to keep track on your busy schedule and
                never miss those important dates. <br />
                Organize parties, meetings, and much more. <br />
                <a href="/aboutus">Click here to see demo</a>
              </p>
              <a href="/login">
                <Button className="homeButtons" width="200px" color="success">
                  <b>Login</b>
                </Button>
              </a>
              <a href="/signup">
                <Button className="homeButtons" color="success">
                  <b>Register</b>
                </Button>
              </a>
            </div>
            <div className="col-xl-12 col-lg-4 col-md-12">
              <img
                className="calendarHomeImg"
                alt="calendar"
                src="./Images/calendarImg.PNG"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default index;
