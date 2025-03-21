import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./gallery.css";
import { db } from "./firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Gallery = () => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slideContent, setSlideContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const cardRef = useRef(null);
  const prevPreviewRef = useRef(null);
  const nextPreviewRef = useRef(null);

  // Fetch gallery data from Firestore
  const fetchGalleryData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const slides = querySnapshot.docs.map((doc) => doc.data());
      setSlideContent(slides);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      setError("Failed to load gallery. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  useEffect(() => {
    // Focus the slider div on mount to enable keyboard navigation
    const sliderDiv = document.querySelector(".slider");
    if (sliderDiv) {
      sliderDiv.focus();
    }

    // Force re-render of the card after mount to fix positioning
    const card = cardRef.current;
    if (card) {
      card.style.transform = "translate(-50%, -50%)";
    }
  }, []);

  const totalSlides = slideContent.length;
  const prevIndex = (activeSlideIndex - 1 + totalSlides) % totalSlides;
  const nextIndex = (activeSlideIndex + 1) % totalSlides;

  // Next and previous slide functions
  const nextSlide = () => {
    if (totalSlides > 1) {
      animateTransition("next");
      setActiveSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      animateTransition("prev");
      setActiveSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    }
  };

  // GSAP animation for transitions
  const animateTransition = (direction) => {
    const card = cardRef.current;

    if (direction === "next") {
      gsap.fromTo(
        card,
        { rotationY: 90, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    } else {
      gsap.fromTo(
        card,
        { rotationY: -90, opacity: 0 },
        { rotationY: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  };

  // Touchscreen support
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      nextSlide(); // Swipe left
    } else if (touchEndX - touchStartX > 50) {
      prevSlide(); // Swipe right
    }
  };

  // Fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Share button functionality
  const shareImage = () => {
    if (navigator.share) {
      navigator.share({
        title: slideContent[activeSlideIndex].title,
        url: slideContent[activeSlideIndex].image,
      }).then(() => {
        alert("Shared successfully!");
      }).catch(() => {
        alert("Sharing failed. Please try again.");
      });
    } else {
      alert("Sharing is not supported in your browser.");
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="skeleton-loader">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
    </div>
  );

  // Retry fetch function
  const retryFetch = () => {
    setIsLoading(true);
    setError(null);
    fetchGalleryData();
  };

  return (
    <>
      <h1 className="gallery-title">Explore Creativity with ARQ</h1>
      <h2 className="arq-title">
        {"A Visual Journey Through Creativity".split("").map((char, index) => (
          <span key={index} className="arq-letter">{char}</span>
        ))}
      </h2>
      <h2 className="moments-title">Moments to Remember</h2>

      <div
        className="slider"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-label="Image Gallery"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prevSlide();
          if (e.key === "ArrowRight") nextSlide();
        }}
      >
        {/* Card Layout */}
        {isLoading ? (
          <SkeletonLoader />
        ) : slideContent.length > 0 ? (
          <div className="card" ref={cardRef}>
            <Zoom>
              <img
                src={slideContent[activeSlideIndex].image}
                alt={`Gallery image: ${slideContent[activeSlideIndex].title}`}
                className="card-image"
                loading="lazy"
              />
            </Zoom>
            <div className="card-content">
              <h2 className="card-title">{slideContent[activeSlideIndex].title}</h2>
              <p className="card-description">
                {slideContent[activeSlideIndex].description || "No description available."}
              </p>
            </div>
          </div>
        ) : (
          <div className="no-images-message">No images available.</div>
        )}

        {/* Side Previews */}
        {slideContent.length > 1 && (
          <>
            <div className="side-preview left" onClick={prevSlide} ref={prevPreviewRef}>
              <img src={slideContent[prevIndex].image} alt="Previous Image" className="preview-image grayscale" />
            </div>
            <div className="side-preview right" onClick={nextSlide} ref={nextPreviewRef}>
              <img src={slideContent[nextIndex].image} alt="Next Image" className="preview-image grayscale" />
            </div>
          </>
        )}

        {/* Thumbnails */}
        {slideContent.length > 1 && (
          <div className="thumbnails">
            {slideContent.map((slide, index) => (
              <img
                key={index}
                src={slide.image + "?w=100"}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${index === activeSlideIndex ? "active" : ""}`}
                onClick={() => setActiveSlideIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {slideContent.length > 0 && (
          <div className="slider-counter">
            <span>{activeSlideIndex + 1}</span>/<span>{totalSlides}</span>
          </div>
        )}

        {/* Progress Bar */}
        {slideContent.length > 0 && (
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${((activeSlideIndex + 1) / totalSlides) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Fullscreen Button */}
        <button className="fullscreen-button" onClick={toggleFullscreen}>
          ⛶
        </button>

        {/* Share Button */}
        <button className="share-button" onClick={shareImage}>
          Share
        </button>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={retryFetch} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {/* Swipe Indicator */}
        <div className="swipe-indicator">
          <span>← Swipe →</span>
        </div>
      </div>
    </>
  );
};

export default Gallery;