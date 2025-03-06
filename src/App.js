import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Gallery from "./Gallery";
import RegisterPage from "./RegisterPage";
import EventPage from "./EventPage";
import Home from "./Home";
import About from "./About";
import Team from "./Team";
import MissionVision from "./MissionVision";
import "./App.css";

function App() {
  return (
    <>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/event">Event Page</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/team">Team</Link></li>
          <li><Link to="/mission-vision">Mission & Vision</Link></li>
          <li><Link to="/register">Register</Link></li> {/* Added Register Link */}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/mission-vision" element={<MissionVision />} />
        <Route path="/register" element={<RegisterPage />} /> {/* Added Register Route */}
      </Routes>
    </>
  );
}

export default App;
