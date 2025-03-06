import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link} from "react-router-dom";
import "./EventPage.css";

const initialEvents = [
  { title: "Hackathon", type: "Technical", date: "2025-03-10T23:59:59", venue: "Main Auditorium", image: "/img/img5.jpg", description: "A 24-hour coding competition where you solve real-world problems.", eventStatus: "Ongoing" },
  { title: "AI/ML Workshop", type: "Technical", date: "2025-03-15T23:59:59", venue: "Lab 1", image: "/img/img5.jpg", description: "Learn about AI and ML with hands-on experience.", eventStatus: "Upcoming" },
  { title: "Photography Contest", type: "Non-Technical", date: "2025-03-18T23:59:59", venue: "Open Ground", image: "/img/img5.jpg", description: "Showcase your photography skills and win prizes.", eventStatus: "Upcoming" },
  { title: "Gaming Tournament", type: "Non-Technical", date: "2025-03-20T23:59:59", venue: "Game Arena", image: "/img/img5.jpg", description: "Compete in the ultimate gaming battle and win exciting rewards.", eventStatus: "Upcoming" },
  { title: "Cybersecurity Workshop", type: "Technical", date: "2025-04-05T23:59:59", venue: "Seminar Hall", image: "/img/img5.jpg", description: "Learn ethical hacking and network security techniques.", eventStatus: "Ongoing" },
  { title: "Tech Expo", type: "Technical", date: "2025-03-02T14:44:00", venue: "Exhibition Hall", image: "/img/img5.jpg", description: "Experience the latest innovations in technology and network with industry experts.", eventStatus: "Upcoming" }
];

const EventPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingTechnical, setUpcomingTechnical] = useState([]);
  const [upcomingNonTechnical, setUpcomingNonTechnical] = useState([]);
  const [timers, setTimers] = useState({});
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowAnimation(false), 10000);
  }, []);

  useEffect(() => {
    setOngoingEvents(events.filter(event => event.eventStatus === "Ongoing"));
    setUpcomingTechnical(events.filter(event => event.eventStatus === "Upcoming" && event.type === "Technical"));
    setUpcomingNonTechnical(events.filter(event => event.eventStatus === "Upcoming" && event.type === "Non-Technical"));
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let updatedEvents = [...events];
      let newTimers = {};

      updatedEvents.forEach(event => {
        if (event.eventStatus === "Upcoming") {
          const eventTime = new Date(event.date).getTime();
          const timeLeft = eventTime - now;

          if (timeLeft <= 0) {
            event.eventStatus = "Ongoing";
          } else {
            newTimers[event.title] = formatTime(timeLeft);
          }
        }
      });

      setTimers(newTimers);
      setEvents(updatedEvents);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const formatTime = (timeLeft) => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  };

  const renderEvent = (event, index) => {
    const timeLeft = timers[event.title] || "Calculating...";
    const isClosingSoon = timeLeft.startsWith("00d");

    return (
      <motion.div key={index} className="event-card" whileHover={{ scale: 1.05 }}>
        <img src={event.image} alt={event.title} className="event-image" />
        <h3 className="event-title">{event.title}</h3>
        <p className="event-details">📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.venue}</p>
        <p className="event-description">{event.description}</p>
        {event.eventStatus === "Upcoming" ? (
          <p className={`event-timer ${isClosingSoon ? "closing-soon" : ""}`}>
            {isClosingSoon ? `⚠️ Register fast! Closing in ${timeLeft}` : `Register ends in: ${timeLeft}`}
          </p>
        ) : (
          <p className="event-status">Event is ongoing</p>
        )}
        {event.eventStatus === "Upcoming" && <Link to="/register" className="register-btn">Register</Link>}
      </motion.div>
    );
  };

  return (
    <div className="event-container">
      {/* Animated Header */}
      <motion.div className={`event-header ${showAnimation ? "rainbow-glow" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        ARQ Event Management
      </motion.div>

      <section className="event-section">
        <h2>Ongoing Events</h2>
        {ongoingEvents.length > 0 ? <div className="event-list">{ongoingEvents.map(renderEvent)}</div> : <p className="no-events">No ongoing events</p>}
      </section>

      <section className="event-section">
        <h2>Upcoming Events</h2>
        
        {/* Technical Events Section */}
        <h3 className="event-subtitle">Technical Events</h3>
        {upcomingTechnical.length > 0 ? <div className="event-list">{upcomingTechnical.map(renderEvent)}</div> : <p className="no-events">No upcoming technical events</p>}
        
        {/* Non-Technical Events Section */}
        <h3 className="event-subtitle">Non-Technical Events</h3>
        {upcomingNonTechnical.length > 0 ? <div className="event-list">{upcomingNonTechnical.map(renderEvent)}</div> : <p className="no-events">No upcoming non-technical events</p>}
      </section>
    </div>
  );
};

export default EventPage;


