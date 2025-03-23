import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import styles from "./EventPage.module.css";
import { getEvents } from "./firebase/eventservice";
import { FaSearch } from "react-icons/fa";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingTechnical, setUpcomingTechnical] = useState([]);
  const [upcomingNonTechnical, setUpcomingNonTechnical] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [timers, setTimers] = useState({});
  const [showAnimation, setShowAnimation] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFinalText, setShowFinalText] = useState(false); // State for Gallery animation

  // Ref for scroll-triggered animations
  const eventCardsRef = useRef([]);

  // Shower Effect
  useEffect(() => {
    const createShowerEffect = () => {
      const showerContainer = document.createElement("div");
      showerContainer.className = styles.showerContainer;

      for (let i = 0; i < 100; i++) {
        const shower = document.createElement("div");
        shower.className = styles.shower;
        shower.style.left = `${Math.random() * 100}vw`;
        shower.style.animationDelay = `${Math.random() * 5}s`;
        shower.style.animationDuration = `${2 + Math.random() * 3}s`;
        showerContainer.appendChild(shower);
      }

      document.body.appendChild(showerContainer);

      // Remove the shower effect after 5 seconds
      setTimeout(() => {
        showerContainer.remove();
      }, 5000);
    };

    createShowerEffect();
  }, []);

  // Stop the Gallery rotating effect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFinalText(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Scroll-triggered animations
  useEffect(() => {
    const handleScrollAnimation = () => {
      eventCardsRef.current.forEach((el) => {
        if (el) {
          const elementTop = el.getBoundingClientRect().top;
          if (elementTop <= window.innerHeight * 0.75) {
            el.classList.add(styles.visible);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, [events]); // Re-run when events change

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getEvents();
      const eventsWithDateObjects = fetchedEvents.map((event) => {
        let date;
        if (event.date && typeof event.date.toDate === "function") {
          date = event.date.toDate();
        } else if (typeof event.date === "string") {
          date = new Date(event.date);
        } else if (event.date instanceof Date) {
          date = event.date;
        } else {
          console.error("Invalid date for event:", event.title, event.date);
          date = new Date();
        }
        return {
          ...event,
          date: date,
        };
      });
      setEvents(eventsWithDateObjects);
    };
    fetchEvents();
  }, []);

  // Update timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setEvents((prevEvents) => {
        return prevEvents.map((event) => {
          if (!event.date || !(event.date instanceof Date)) {
            return event;
          }
          const eventTime = event.date.getTime();
          const timeLeft = eventTime - now;
          if (timeLeft <= 0) {
            if (event.eventStatus === "Upcoming") {
              event.eventStatus = "Ongoing";
            } else if (event.eventStatus === "Ongoing" && timeLeft <= -129600000) {
              event.eventStatus = "Completed";
            }
          }
          return event;
        });
      });

      setTimers((prevTimers) => {
        const newTimers = {};
        events.forEach((event) => {
          if (event.date && event.date instanceof Date) {
            const eventTime = event.date.getTime();
            const timeLeft = eventTime - now;
            if (timeLeft > 0) {
              newTimers[event.title] = formatTime(timeLeft);
            }
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  // Categorize events
  useEffect(() => {
    setOngoingEvents(events.filter((event) => event.eventStatus === "Ongoing"));
    setUpcomingTechnical(events.filter((event) => event.eventStatus === "Upcoming" && event.type === "Technical"));
    setUpcomingNonTechnical(events.filter((event) => event.eventStatus === "Upcoming" && event.type === "Non-Technical"));
    setCompletedEvents(events.filter((event) => event.eventStatus === "Completed"));
  }, [events]);

  const formatTime = (timeLeft) => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const section = document.getElementById(tab);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderEvent = (event, index) => {
    if (!event.date || !(event.date instanceof Date)) {
      return null;
    }
    const timeLeft = timers[event.title];
    const eventTime = event.date.getTime();
    const now = new Date().getTime();
    const isClosingSoon = eventTime - now <= 86400000;

    return (
      <motion.div
        key={index}
        className={`${styles.eventCard} ${styles.scrollAnimation}`}
        ref={(el) => (eventCardsRef.current[index] = el)}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
        viewport={{ once: true }}
      >
        <div className={styles.eventImageContainer}>
          <img src={event.image} alt={event.title} className={styles.eventImage} />
        </div>
        <div className={styles.eventContent}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          <p className={styles.eventDetails}>📅 {event.date.toLocaleDateString()} | 📍 {event.venue}</p>
          <p className={styles.eventDescription}>{event.description}</p>
          {event.eventStatus === "Upcoming" && (
            <p className={`${styles.eventTimer} ${isClosingSoon ? styles.closingSoon : ""}`}>
              {timeLeft ? `Event starts in: ${timeLeft}` : "Event closed"}
            </p>
          )}
          {event.eventStatus === "Ongoing" && (
            <p className={styles.eventStatus}>Event is ongoing</p>
          )}
          {event.eventStatus === "Completed" && (
            <p className={styles.eventStatus}>Event completed</p>
          )}
          {event.eventStatus === "Upcoming" && (
            <Link to="/register" className={styles.registerBtn}>
              Register
            </Link>
          )}
        </div>
      </motion.div>
    );
  };

  const renderNoEventsMessage = (category) => {
    return <div className={styles.noEventsMessage}>No {category} events available.</div>;
  };

  return (
    <div className={styles.eventContainer}>
      {/* Shower Effect (already handled in useEffect) */}

      {/* Gallery Component */}
      <div className={styles.galleryContainer}>
        <motion.div
          className={styles.finalText}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          ARQ CLUB EVENTS
        </motion.div>
      </div>

      {/* ARQ Event Management Header */}
      <motion.div
        className={`${styles.eventHeader} ${showAnimation ? styles.rainbowGlow : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        ARQ Event Management
      </motion.div>

      <div className={styles.navigation}>
        <div className={styles.searchBar}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.tabs}>
          <button onClick={() => handleTabClick("upcoming")}>Upcoming</button>
          <button onClick={() => handleTabClick("ongoing")}>Ongoing</button>
          <button onClick={() => handleTabClick("completed")}>Completed</button>
        </div>
      </div>

      <section id="upcoming" className={styles.eventSection}>
        <h2>Upcoming Events</h2>
        <h3 className={styles.eventSubtitle}>Technical Events</h3>
        <div className={styles.eventList}>
          {upcomingTechnical.length > 0
            ? upcomingTechnical
                .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("upcoming technical")}
        </div>

        <h3 className={styles.eventSubtitle}>Non-Technical Events</h3>
        <div className={styles.eventList}>
          {upcomingNonTechnical.length > 0
            ? upcomingNonTechnical
                .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("upcoming non-technical")}
        </div>
      </section>

      <section id="ongoing" className={styles.eventSection}>
        <h2>Ongoing Events</h2>
        <div className={styles.eventList}>
          {ongoingEvents.length > 0
            ? ongoingEvents
                .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("ongoing")}
        </div>
      </section>

      <section id="completed" className={styles.eventSection}>
        <h2>Completed Events</h2>
        <div className={styles.eventList}>
          {completedEvents.length > 0
            ? completedEvents
                .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((event, index) => renderEvent(event, index))
            : renderNoEventsMessage("completed")}
        </div>
      </section>
    </div>
  );
};

export default EventPage;