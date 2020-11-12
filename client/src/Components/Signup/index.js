import React, { Component } from "react";
import API from "../../utils/API";
import { Button, Form, FormGroup, Input } from "reactstrap";
import "./style.css";
// import { Link } from "react-router-dom";

class SignUp extends Component {
  state = {
    username: "",
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    errorMsg: "",
  };
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (
      !this.state.username ||
      !this.state.lastName ||
      !this.state.firstName ||
      !this.state.email ||
      !this.state.password ||
      !this.state.password2
    ) {
      alert("Please fill out all the required fields *");
      return;
    }
    if (this.state.password !== this.state.password2) {
      this.setState({
        errorMsg: "Passwords don't match!",
      });
      return;
    }
    if (this.state.password.length < 6) {
      this.setState({
        errorMsg: "Password must be at least 6 characters long!",
      });
      return;
    }

    API.addUser({
      username: this.state.username,
      lastName: this.state.lastName.replace(/^./, (str) => str.toUpperCase()),
      firstName: this.state.firstName.replace(/^./, (str) => str.toUpperCase()),
      phone: this.state.phone,
      email: this.state.email,
      password: this.state.password,
    })
      .then((res) => {
        if (res.data.status === 400) {
          this.setState({
            errorMsg: res.data.message,
          });
          return;
        } else {
          this.setState({
            username: "",
            lastName: "",
            firstName: "",
            email: "",
            phone: "",
            password: "",
            password2: "",
          });
          alert("You can Log-in now!");
          window.location.href = "/login";
        }
      })

      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div className="container signupPage">
        <div className="col-md-12 signupTitle">
          <h4 className="signupTitleInSignup">
            Create an account to start managing your events
          </h4>
        </div>
        <div className="row">
          <div className="col-md-6 instructionsBoxSignup">
            <h3 className="signupTitleInSignup">Event Organizer</h3>
            <p className="instructionsSignupParagraph">
              By creating an account, you will be able to create events using a
              calendar and manage your time in a more organized and better way
            </p>
            <img
              className="calendarImageSignup"
              alt="calendar"
              src="./Images/calendarImg.PNG"
            />
          </div>
          <div className="col-md-6 signupForm">
            <div className="formGrid">
              <Form className="formboxSignup" onSubmit={this.handleSubmit}>
                <h4
                  className="registerTitle"
                  style={{ textAlign: "center", marginTop: "15px" }}
                >
                  Register
                </h4>
                <p style={{ textAlign: "left" }}>* Required</p>

                <FormGroup>
                  <hr style={{ background: "grey", marginTop: "10px" }}></hr>
                  <div className="input-field">
                    <label htmlFor="username">* Username</label>
                    <Input
                      className="form-control"
                      type="text"
                      id="username"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="lastName">* Last Name</label>
                    <Input
                      className="form-control"
                      type="text"
                      id="lastName"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="firstName">* First Name</label>
                    <Input
                      className="form-control"
                      type="text"
                      id="firstName"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="phone">Phone</label>
                    <Input
                      className="form-control"
                      type="text"
                      id="phone"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="email">* Email</label>
                    <Input
                      className="form-control"
                      type="text"
                      id="email"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="password">* Password</label>
                    <Input
                      className="form-control"
                      type="password"
                      id="password"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="password2">* Confirm Password</label>
                    <Input
                      className="form-control"
                      type="password"
                      id="password2"
                      onChange={this.handleChange}
                    />
                  </div>
                  <h5
                    style={{
                      textAlign: "center",
                      color: "red",
                      paddingBottom: "10px",
                    }}
                  >
                    {this.state.errorMsg}
                  </h5>
                  <div className="input-field">
                    <Button
                      style={{ marginTop: "30px" }}
                      className="btn-primary"
                    >
                      Create Account
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
