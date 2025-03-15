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
/* import React, { useState, useEffect } from "react";
import { addEvent, getEvents, updateEvent, deleteEvent } from "./firebaseFunctions";

const App = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", type: "", date: "", venue: "", description: "", eventStatus: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleAddEvent = async () => {
    if (!image) return alert("Please select an image!");
    await addEvent(newEvent, image);
    fetchEvents();
  };

  return (
    <div>
      <h1>Event Manager</h1>
      <input type="text" placeholder="Title" onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
      <input type="text" placeholder="Type" onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} />
      <input type="datetime-local" onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
      <input type="text" placeholder="Venue" onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
      <textarea placeholder="Description" onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
      <select onChange={(e) => setNewEvent({ ...newEvent, eventStatus: e.target.value })}>
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
      </select>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleAddEvent}>Add Event</button>

      <h2>Events List</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <img src={event.image} alt={event.title} width="100" />
            <p>{event.description}</p>
            <button onClick={() => updateEvent(event.id, { eventStatus: "Completed" })}>Mark as Completed</button>
            <button onClick={() => deleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
 */