import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import AboutUs from "./Pages/AboutUs";
import { CardFooter } from "reactstrap";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="appHeader">
          <img
            className="logo justify-content-center"
            alt="logo"
            src="./Images/logoEventManagement.png"
          />
        </div>
        <Navbar />
        <div className="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/aboutus" component={AboutUs} />
          </Switch>
          <CardFooter className="footer">
            Alexis Yepes Sanabria 2019 ©{" "}
            <a
              target="blank"
              href="https://github.com/alexisyepes/event-management-system"
            >
              Click for code reference <i className="fab fa-github"></i>
            </a>
          </CardFooter>
        </div>
      </Router>
    );
  }
}

export default App;
