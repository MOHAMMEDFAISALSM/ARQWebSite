import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./EventPage.module.css";

// Initial events array
const initialEvents = [
  { title: "Hackathon", type: "Technical", date: "2025-03-10T23:59:59", venue: "Main Auditorium", image: "/img/img5.jpg", description: "A 24-hour coding competition where you solve real-world problems.", eventStatus: "Ongoing" },
  { title: "AI/ML Workshop", type: "Technical", date: "2025-03-15T23:59:59", venue: "Lab 1", image: "/img/img5.jpg", description: "Learn about AI and ML with hands-on experience.", eventStatus: "Upcoming" },
  { title: "Photography Contest", type: "Non-Technical", date: "2025-03-18T23:59:59", venue: "Open Ground", image: "/img/img5.jpg", description: "Showcase your photography skills and win prizes.", eventStatus: "Upcoming" },
  { title: "Gaming Tournament", type: "Non-Technical", date: "2025-03-20T23:59:59", venue: "Game Arena", image: "/img/img5.jpg", description: "Compete in the ultimate gaming battle and win exciting rewards.", eventStatus: "Upcoming" },
  { title: "Cybersecurity Workshop", type: "Technical", date: "2025-04-05T23:59:59", venue: "Seminar Hall", image: "/img/img5.jpg", description: "Learn ethical hacking and network security techniques.", eventStatus: "Ongoing" },
  { title: "Tech Expo", type: "Technical", date: "2025-03-02T14:44:00", venue: "Exhibition Hall", image: "/img/img5.jpg", description: "Experience the latest innovations in technology and network with industry experts.", eventStatus: "Completed" },
  { title: "Code Sprint", type: "Technical", date: "2025-03-22T23:59:59", venue: "CS Lab", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Robotics Workshop", type: "Technical", date: "2025-03-25T23:59:59", venue: "Engineering Block", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Math Olympiad", type: "Technical", date: "2025-03-28T23:59:59", venue: "Math Department", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Cultural Fest", type: "Non-Technical", date: "2025-04-10T23:59:59", venue: "Main Stage", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Drama Night", type: "Non-Technical", date: "2025-04-12T23:59:59", venue: "Theater Hall", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Debate Competition", type: "Non-Technical", date: "2025-04-15T23:59:59", venue: "Auditorium", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Art Exhibition", type: "Non-Technical", date: "2025-04-18T23:59:59", venue: "Art Hall", eventStatus: "Upcoming", image: "/img/img5.jpg" },
  { title: "Robotics Competition", type: "Technical", date: "2025-03-28T23:59:59", venue: "Engineering Lab", eventStatus: "Upcoming", image: "/img/img5.jpg" }

];

const EventPage = () => {
  const [events, setEvents] = useState(initialEvents);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingTechnical, setUpcomingTechnical] = useState([]);
  const [upcomingNonTechnical, setUpcomingNonTechnical] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [timers, setTimers] = useState({});
  const [showAnimation, setShowAnimation] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    setTimeout(() => setShowAnimation(false), 10000);
  }, []);

  // Update event statuses and timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let updatedEvents = [...events];
      let newTimers = {};

      updatedEvents.forEach((event) => {
        const eventTime = new Date(event.date).getTime();
        const timeLeft = eventTime - now;

        if (timeLeft <= 0) {
          // Event has started or completed
          if (event.eventStatus === "Upcoming") {
            event.eventStatus = "Ongoing";
          } else if (event.eventStatus === "Ongoing" && timeLeft <= -86400000) {
            // If the event has been ongoing for more than 24 hours, mark it as completed
            event.eventStatus = "Completed";
          }
        } else {
          // Event is still upcoming
          newTimers[event.title] = formatTime(timeLeft);
        }
      });

      setTimers(newTimers);
      setEvents(updatedEvents);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  // Categorize events into sections
  useEffect(() => {
    setOngoingEvents(events.filter((event) => event.eventStatus === "Ongoing"));
    setUpcomingTechnical(events.filter((event) => event.eventStatus === "Upcoming" && event.type === "Technical"));
    setUpcomingNonTechnical(events.filter((event) => event.eventStatus === "Upcoming" && event.type === "Non-Technical"));
    setCompletedEvents(events.filter((event) => event.eventStatus === "Completed"));
  }, [events]);

  // Format time left for upcoming events
  const formatTime = (timeLeft) => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  };

  // Render each event card
  const renderEvent = (event, index) => {
    const timeLeft = timers[event.title] || "Calculating...";
    const isClosingSoon = timeLeft.startsWith("00d");

    return (
      <motion.div
        key={index}
        className={styles.eventCard}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, rotateY: 90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        <img src={event.image} alt={event.title} className={styles.eventImage} />
        <h3 className={styles.eventTitle}>{event.title}</h3>
        <p className={styles.eventDetails}>📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.venue}</p>
        <p className={styles.eventDescription}>{event.description}</p>
        {event.eventStatus === "Upcoming" ? (
          <p className={`${styles.eventTimer} ${isClosingSoon ? styles.closingSoon : ""}`}>
            {isClosingSoon ? `⚠️ Register fast! Closing in ${timeLeft}` : `Register ends in: ${timeLeft}`}
          </p>
        ) : (
          <p className={styles.eventStatus}>{event.eventStatus === "Ongoing" ? "Event is ongoing" : "Event completed"}</p>
        )}
        {event.eventStatus === "Upcoming" && <Link to="/register" className={styles.registerBtn}>Register</Link>}
      </motion.div>
    );
  };

  return (
    <div className={styles.eventContainer}>
      {/* Animated Header */}
      <motion.div className={`${styles.eventHeader} ${showAnimation ? styles.rainbowGlow : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        ARQ Event Management
      </motion.div>

      <section className={styles.eventSection}>
        <h2>Upcoming Events</h2>
        
        {/* Technical Events Section */}
        <h3 className={styles.eventSubtitle}>Technical Events</h3>
        <div className={styles.eventList}>
          {upcomingTechnical.map((event, index) => renderEvent(event, index))}
        </div>
        
        {/* Non-Technical Events Section */}
        <h3 className={styles.eventSubtitle}>Non-Technical Events</h3>
        <div className={styles.eventList}>
          {upcomingNonTechnical.map((event, index) => renderEvent(event, index))}
        </div>
      </section>

      <section className={styles.eventSection}>
        <h2>Ongoing Events</h2>
        <div className={styles.eventList}>
          {ongoingEvents.map((event, index) => renderEvent(event, index))}
        </div>
      </section>

      <section className={styles.eventSection}>
        <h2>Completed Events</h2>
        <div className={styles.eventList}>
          {completedEvents.map((event, index) => renderEvent(event, index))}
        </div>
      </section>
    </div>
  );
};

export default EventPage;