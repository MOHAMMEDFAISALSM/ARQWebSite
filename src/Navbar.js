import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
        Home
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
        Events
      </NavLink>
    </nav>
  );
};

export default Navbar;
