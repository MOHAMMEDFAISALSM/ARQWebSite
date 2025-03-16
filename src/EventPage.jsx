import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./EventPage.module.css";
import { getEvents } from "./firebase/eventservice"; // Import the getEvents function

const EventPage = () => {
  const [events, setEvents] = useState([]);
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

  // Fetch events from Firestore on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getEvents();
      // Convert the `date` field from string to Date object
      const eventsWithDateObjects = fetchedEvents.map((event) => ({
        ...event,
        date: new Date(event.date), // Convert string to Date object
      }));
      console.log("Fetched Events with Date Objects:", eventsWithDateObjects); // Debugging
      setEvents(eventsWithDateObjects);
    };

    fetchEvents();
  }, []);

  // Update event statuses and timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      let updatedEvents = [...events];
      let newTimers = {};
  
      updatedEvents.forEach((event) => {
        const eventTime = event.date.getTime(); // Use the Date object
        const timeLeft = eventTime - now;
        console.log("Event:", event.title, "Time Left:", timeLeft); // Debugging
  
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
  
      console.log("New Timers:", newTimers); // Debugging
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
    console.log("Event:", event.title, "Time Left:", timeLeft); // Debugging
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
        <p className={styles.eventDetails}>📅 {event.date.toLocaleDateString()} | 📍 {event.venue}</p>
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

  // Render a message if no events are available
  const renderNoEventsMessage = (category) => {
    return (
      <div className={styles.noEventsMessage}>
        No {category} events available.
      </div>
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
          {upcomingTechnical.length > 0
            ? upcomingTechnical.map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("upcoming technical")}
        </div>
        
        {/* Non-Technical Events Section */}
        <h3 className={styles.eventSubtitle}>Non-Technical Events</h3>
        <div className={styles.eventList}>
          {upcomingNonTechnical.length > 0
            ? upcomingNonTechnical.map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("upcoming non-technical")}
        </div>
      </section>

      <section className={styles.eventSection}>
        <h2>Ongoing Events</h2>
        <div className={styles.eventList}>
          {ongoingEvents.length > 0
            ? ongoingEvents.map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("ongoing")}
        </div>
      </section>

      <section className={styles.eventSection}>
        <h2>Completed Events</h2>
        <div className={styles.eventList}>
          {completedEvents.length > 0
            ? completedEvents.map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("completed")}
        </div>
      </section>
    </div>
  );
};

export default EventPage;