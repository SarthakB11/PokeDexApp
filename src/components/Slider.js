import React, { useState, useEffect } from 'react';

const Slider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="slider">
      <button className="prev-button" onClick={prevSlide}>❮</button>
      <div className="slide-container">
        {images.map((image, index) => (
          <div
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            key={index}
          >
            {index === currentIndex && (
              <img src={image} alt={`Slide ${index + 1}`} className="slider-image" />
            )}
          </div>
        ))}
      </div>
      <button className="next-button" onClick={nextSlide}>❯</button>
    </div>
  );
};

export default Slider;
