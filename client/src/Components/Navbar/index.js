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
      setUsername(username);
    } else {
      try {
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
      <Navbar color="dark" light expand="md">
        <NavbarBrand className="text-light" href="/">
          Event Management
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {authorized ? (
              <>
                <NavItem className="loggedIn">
                  <span disabled="disabled" className="btn text-info">
                    Logged in as: {username}
                  </span>
                </NavItem>
                <NavItem>
                  <Form inline>
                    <button
                      className="btn btn-warning text-light mr-1"
                      onClick={handleLogOut}
                    >
                      Logout
                    </button>
                  </Form>
                </NavItem>

                <NavItem>
                  <NavLink
                    className="text-light  nav-items-custom"
                    href="/profile"
                  >
                    Control Panel
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
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
                    Log in
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

// import React, { Component } from "react";
// import axios from "axios";

// import "./style.css";

// class index extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       username: "",
//       authorized: false,
//     };
//   }

//   async componentDidMount() {
//     const accessString = localStorage.getItem("JWT");
//     if (accessString == null) {
//       this.setState({
//         authorized: false,
//         username: "",
//       });
//     } else {
//       try {
//         const response = await axios.get("/auth/profile", {
//           headers: { Authorization: `JWT ${accessString}` },
//         });
//         this.setState({
//           username: response.data.username,
//           authorized: true,
//         });
//       } catch (error) {
//         console.error(error.response);
//       }
//     }
//   }

//   //Logout User
//   handleLogOut(e) {
//     e.preventDefault();
//     localStorage.removeItem("JWT");
//     window.location.href = "/";
//   }

//   render() {
//     const username = this.state.username;
//     const authorized = this.state.authorized;

//     if (authorized) {
//       return (
//         <nav className="navbar navbar-expand-lg navbar-light bg-light">
//           <a className="navbar-brand" href="/">
//             Menu
//           </a>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-toggle="collapse"
//             data-target="#navbarNavAltMarkup"
//             aria-controls="navbarNavAltMarkup"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
//             <div className="navbar-nav">
//               <a className="nav-item nav-link active" href="/">
//                 Home <span className="sr-only">(current)</span>
//               </a>
//               <a className="nav-item nav-link" href="/aboutus">
//                 About
//               </a>
//               <a className="nav-item nav-link" href="/profile">
//                 My Profile
//               </a>
//             </div>
//             <p className="usernameLoggedinHome">Logged in as {username}</p>
//             <button className="logoutBtnNavbar" onClick={this.handleLogOut}>
//               Logout
//             </button>
//           </div>
//         </nav>
//       );
//     }

//     return (
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         <a className="navbar-brand menuNoAuth" href="/">
//           Menu
//         </a>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-toggle="collapse"
//           data-target="#navbarNavAltMarkup"
//           aria-controls="navbarNavAltMarkup"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
//           <div className="navbar-nav">
//             <a className="nav-item nav-link active linksNavbarNoAuth" href="/">
//               Home <span className="sr-only">(current)</span>
//             </a>
//             <a className="nav-item nav-link linksNavbarNoAuth" href="/aboutus">
//               About
//             </a>
//             <a className="nav-item nav-link linksNavbarNoAuth" href="/signup">
//               Register
//             </a>
//             <a className="nav-item nav-link linksNavbarNoAuth" href="/login">
//               Login
//             </a>
//           </div>
//         </div>
//       </nav>
//     );
//   }
// }

// export default index;
