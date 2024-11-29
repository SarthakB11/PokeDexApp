import React, { useEffect, useState } from 'react';
import Slider from 'react-slick'; // Import react-slick carousel

const PokemonOrigins = ({ pokemonList }) => {
  const [origins, setOrigins] = useState([]);

  useEffect(() => {
    const fetchOrigins = async () => {
      try {
        setOrigins(pokemonList);
      } catch (error) {
        console.error('Error setting origins:', error);
      }
    };

    fetchOrigins();
  }, [pokemonList]);

  // Slider settings for react-slick
  const settings = {
    dots: true, // Pagination dots
    infinite: true, // Infinite looping of slides
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable auto-scrolling
    autoplaySpeed: 3000, // Time per slide
    arrows: true, // Left and right arrows
  };

  return (
    <div className="pokemon-origins">
      <h2>Pokémon Origins</h2>
      <Slider {...settings}>
        {origins.map((origin) => (
          <div key={origin.name} className="origin-slide">
            <img 
              src={origin.image} 
              alt={origin.name} 
              className="origin-image"
              onError={(e) => { e.target.src = '/path/to/default/image.png'; }} // Fallback for broken images
            />
            <div className="origin-content">
              <h3>{origin.name}</h3>
              <p>{origin.origin}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PokemonOrigins;
