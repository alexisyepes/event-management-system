import React, { Component } from "react";
import axios from "axios";
import { Button, Form, FormGroup, Input } from "reactstrap";

import "./style.css";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    errorMessage: "",
    loggedIn: false,
    showError: false,
    showNullError: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };
  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === "" || password === "") {
      this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false,
      });
    } else {
      try {
        const response = await axios.post("/auth/login", {
          email,
          password,
        });
        localStorage.setItem("JWT", response.data.token);
        localStorage.setItem("USERNAME", response.data.updatedUser.username);
        localStorage.setItem("NAME", response.data.updatedUser.firstName);
        console.log(response);
        this.setState({
          loggedIn: true,
          showError: false,
          showNullError: false,
        });
        window.location.href = "/profile";
      } catch (error) {
        console.error(error.response);
        this.setState({
          errorMessage: error.response.data.message,
        });
        console.log(error);
      }
    }
  };
  render() {
    return (
      <div className="container signinPage">
        <div
          className="text-center"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Form className="formBox" onSubmit={this.handleSubmit.bind(this)}>
            <h4
              className="grey-text text-darken-3"
              style={{ textAlign: "center", marginTop: "15px" }}
            >
              Sign in
            </h4>
            <hr style={{ background: "black" }}></hr>
            <FormGroup>
              <Input
                className="mb-3"
                placeholder="Email"
                // style={{ float: "right" }}
                type="email"
                id="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <Input
                placeholder="Password"
                // style={{ float: "right", marginBottom: "15px" }}
                type="password"
                id="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <Button style={{ marginTop: "15px" }} className="btn-primary ">
                Login
              </Button>
            </FormGroup>
            <p>
              Don't have an account yet? <br />
              <a href="/signup">Click here to register</a>
            </p>
            <h4
              style={{
                textAlign: "center",
                color: "red",
                paddingBottom: "10px",
              }}
            >
              {this.state.errorMessage}
            </h4>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignIn;
