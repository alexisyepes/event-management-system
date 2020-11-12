import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Form,
} from "reactstrap";
import "./style.css";

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const accessString = localStorage.getItem("JWT");
    const username = localStorage.getItem("USERNAME");
    if (accessString == null) {
      setAuthorized(false);
    } else {
      try {
        setUsername(username);
        setAuthorized(true);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  //Logout User
  const handleLogOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("JWT");
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar className="navbar-custom-class" color="dark" light expand="md">
        {/* <NavbarBrand className="text-light" href="/">
          <i className="fas fa-home"></i>
        </NavbarBrand> */}
        <span className="hamburger-icon">
          <i onClick={toggle} className="fas fa-bars text-light"></i>
        </span>

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {authorized ? (
              <>
                <NavItem className="loggedIn mr-3 nav-items-custom">
                  <Form inline>
                    <span disabled="disabled" className="btn text-info">
                      Logged in as: {username}
                    </span>
                  </Form>
                </NavItem>
                <NavItem className="nav-items-custom">
                  <Form inline>
                    <button
                      className="btn btn-logout text-light mr-1"
                      onClick={handleLogOut}
                    >
                      Logout
                    </button>
                  </Form>
                </NavItem>

                <NavItem>
                  <Form inline>
                    <NavLink
                      className="text-light  nav-items-custom btn text-info"
                      href="/profile"
                    >
                      Control Panel
                    </NavLink>
                  </Form>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink className="text-light  nav-items-custom" href="/">
                    <i className="fas fa-home"></i>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="text-light  nav-items-custom"
                    href="/aboutus"
                  >
                    About this site
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="text-light  nav-items-custom"
                    href="/login"
                  >
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className="text-light  nav-items-custom"
                    href="/signup"
                  >
                    Register
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Example;
