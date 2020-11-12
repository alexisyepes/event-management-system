import React, { Component } from "react";
import "./style.css";

class index extends Component {
  render() {
    return (
      <div className="container aboutMainComp">
        <h1 className="aboutTitle">About This App</h1>
        <hr style={{ background: "black" }}></hr>
        <div>
          <div className="row row1">
            <p className="col-md-6 par1">
              This application is used to manage personal events such as
              meetings, parties, appointments, etc. After creating an account,
              you will be able to login to your personal profile and start
              adding those important events to your calendar.
            </p>
            <img
              className="col-md-6"
              alt="guest 1"
              src="./Images/saveEvents.PNG"
            ></img>
          </div>
          <div className="row row1">
            <img
              className="col-md-6"
              alt="guest 1"
              src="./Images/guests1.PNG"
            ></img>
            <p className="col-md-5 par1">
              If any of your events have guests, you can create a list of all
              intended guests to invite. Then, you will have the option to
              select if the guests have confirmed attendance or not.
            </p>
          </div>
          <div className="row row1">
            <p className="col-md-6 par1">
              If they have confirmed, the background color will change to green,
              so you can easily differenciate between confirmed guests and
              not-confirmed guests.
            </p>
            <img
              className="col-md-6"
              alt="guest 3"
              src="./Images/guests3.PNG"
            ></img>
          </div>

          <h6 className="videoInstructionsReg">
            Down below, there's a demo explaining how to use this application.
          </h6>
          <img
            className="arrowDown videoInstructionsReg"
            alt="arrow down"
            src="./Images/arrowDown.png"
          ></img>
        </div>

        <div>
          <h3 className="aboutTitles videoInstructionsReg">
            Registration process
          </h3>
          <video className="videoInstructionsReg" controls>
            <source src="./Videos/eventAppFirstPart.mp4"></source>
          </video>
        </div>
        <div>
          <h3 className="aboutTitles videoInstructionsReg">
            Event creation process
          </h3>
          <video controls className="videoInstructionsReg">
            <source src="./Videos/eventAppSecondPart.mp4"></source>
          </video>
        </div>
      </div>
    );
  }
}

export default index;
