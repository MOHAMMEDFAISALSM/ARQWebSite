import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import './gallery.css';
import { db } from './firebase/firebaseConfig'; // Import Firebase config
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

const Gallery = () => {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [slideContent, setSlideContent] = useState([]); // State to store gallery data
    const cardRef = useRef(null);
    const prevPreviewRef = useRef(null);
    const nextPreviewRef = useRef(null);

    // Fetch gallery data from Firestore
    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "gallery"));
                const slides = querySnapshot.docs.map((doc) => doc.data());
                setSlideContent(slides);
            } catch (error) {
                console.error("Error fetching gallery data:", error);
            }
        };

        fetchGalleryData();
    }, []);

    const totalSlides = slideContent.length;

    // Function to move to the next slide
    const nextSlide = () => {
        if (totalSlides > 1) {
            animateTransition("next");
            setActiveSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        }
    };

    // Function to move to the previous slide
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
            gsap.fromTo(card, 
                { rotationY: 90, opacity: 0 }, 
                { rotationY: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        } else {
            gsap.fromTo(card, 
                { rotationY: -90, opacity: 0 }, 
                { rotationY: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        }
    };

    // Get the previous and next slide indices
    const prevIndex = (activeSlideIndex - 1 + totalSlides) % totalSlides;
    const nextIndex = (activeSlideIndex + 1) % totalSlides;

    return (
        <>
            {/* Add the title from the old file */}
            <h1 className="gallery-title">Explore Creativity with ARQ</h1>
            <h2 className="arq-title">
                {"A Visual Journey Through Creativity".split("").map((char, index) => (
                    <span key={index} className="arq-letter">{char}</span>
                ))}
            </h2>
            <h2 className="moments-title">Moments to Remember</h2>

            {/* Slider Structure */}
            <div className="slider">
                {/* Background Images */}
                <div className="background-images">
                    {slideContent.length > 0 ? (
                        slideContent.map((slide, index) => (
                            <div
                                key={index}
                                className={`background-image ${index === activeSlideIndex ? "active" : ""}`}
                                style={{ backgroundImage: `url(${slide.image})` }}
                            ></div>
                        ))
                    ) : (
                        <div className="no-images-message">No images available.</div>
                    )}
                </div>

                {/* Card Layout */}
                {slideContent.length > 0 ? (
                    <div className="card" ref={cardRef}>
                        <img src={slideContent[activeSlideIndex].image} alt="Current Image" className="card-image" />
                        <div className="card-content">
                            <h2 className="card-title">{slideContent[activeSlideIndex].title}</h2>
                            <p className="card-description">{slideContent[activeSlideIndex].description}</p>
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

                {/* Counter */}
                {slideContent.length > 0 && (
                    <div className="slider-counter">
                        <span>{activeSlideIndex + 1}</span>/<span>{totalSlides}</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default Gallery;