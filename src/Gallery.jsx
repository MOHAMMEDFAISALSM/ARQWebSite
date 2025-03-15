import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import Img1 from './img/img1.jpeg';
import Img2 from './img/img2.jpeg';
import Img3 from './img/img3.jpeg';
import Img4 from './img/img4.jpeg';
import Img5 from './img/img5.jpeg';
import Img6 from './img/img6.jpeg';
import Img7 from './img/img7.jpeg';
import './gallery.css';

const Gallery = () => {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const cardRef = useRef(null);
    const prevPreviewRef = useRef(null);
    const nextPreviewRef = useRef(null);

    // Dynamic content for each slide
    const slideContent = [
        {
            title: "Serene Space",
            description: "A tranquil escape into nature's embrace.",
            image: Img1
        },
        {
            title: "Majestic Mountain",
            description: "Stand tall and embrace the heights.",
            image: Img2
        },
        {
            title: "Lush Jungle",
            description: "Explore the wild and untamed beauty.",
            image: Img3
        },
        {
            title: "Mystic Forest",
            description: "Step into a world of mystery and wonder.",
            image: Img4
        },
        {
            title: "Calm Coast",
            description: "Feel the serenity of the endless horizon.",
            image: Img5
        },
        {
            title: "Whimsical Woods",
            description: "A magical journey through enchanted trees.",
            image: Img6
        },
        {
            title: "Enchanted Oasis",
            description: "Discover peace in the heart of the desert.",
            image: Img7
        }
    ];

    const totalSlides = slideContent.length;

    // Function to move to the next slide
    const nextSlide = () => {
        animateTransition("next");
        setActiveSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    // Function to move to the previous slide
    const prevSlide = () => {
        animateTransition("prev");
        setActiveSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
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
                    {slideContent.map((slide, index) => (
                        <div
                            key={index}
                            className={`background-image ${index === activeSlideIndex ? "active" : ""}`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        ></div>
                    ))}
                </div>

                {/* Card Layout */}
                <div className="card" ref={cardRef}>
                    <img src={slideContent[activeSlideIndex].image} alt="Current Image" className="card-image" />
                    <div className="card-content">
                        <h2 className="card-title">{slideContent[activeSlideIndex].title}</h2>
                        <p className="card-description">{slideContent[activeSlideIndex].description}</p>
                    </div>
                </div>

                {/* Side Previews */}
                <div className="side-preview left" onClick={prevSlide} ref={prevPreviewRef}>
                    <img src={slideContent[prevIndex].image} alt="Previous Image" className="preview-image grayscale" />
                </div>
                <div className="side-preview right" onClick={nextSlide} ref={nextPreviewRef}>
                    <img src={slideContent[nextIndex].image} alt="Next Image" className="preview-image grayscale" />
                </div>

                {/* Counter */}
                <div className="slider-counter">
                    <span>{activeSlideIndex + 1}</span>/<span>{totalSlides}</span>
                </div>
            </div>
        </>
    );
};

export default Gallery;