import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const PokemonFavorites = ({ favoritePokemon, toggleFavorite, PokemonCardComponent }) => {
  const [favoriteDetails, setFavoriteDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch details for favorite Pokemon
  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      if (!favoritePokemon || favoritePokemon.length === 0) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const detailsPromises = favoritePokemon.map(async (name) => {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return {
            id: response.data.id,
            name: response.data.name,
            image: response.data.sprites.other['official-artwork'].front_default || response.data.sprites.front_default,
            types: response.data.types
          };
        });
        
        const details = await Promise.all(detailsPromises);
        setFavoriteDetails(details);
      } catch (error) {
        console.error('Error fetching favorite Pokemon details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFavoriteDetails();
  }, [favoritePokemon]);
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="favorites-container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="favorites-title"
        >
          My Favorite Pokémon
        </motion.h2>
        
        <motion.div
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="pokeball-loading"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="pokeball">
              <div className="pokeball-top"></div>
              <div className="pokeball-middle"></div>
              <div className="pokeball-bottom"></div>
              <div className="pokeball-button"></div>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading your favorite Pokémon...
          </motion.p>
        </motion.div>
      </div>
    );
  }
  
  // Empty state
  if (!favoritePokemon || favoritePokemon.length === 0) {
    return (
      <div className="favorites-container">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="favorites-title"
        >
          My Favorite Pokémon
        </motion.h2>
        
        <motion.div
          className="empty-favorites"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="empty-icon">💔</div>
          <h3>No favorites yet</h3>
          <p>You haven't added any Pokémon to your favorites yet.</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="return-home-button">
              Return to PokéDex
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="favorites-title"
      >
        My Favorite Pokémon
      </motion.h2>
      
      <motion.div 
        className="pokemon-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {favoriteDetails.map((pokemon) => (
            <motion.div 
              key={pokemon.name} 
              variants={itemVariants}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                transition: { duration: 0.3 } 
              }}
            >
              {PokemonCardComponent ? (
                <Link to={`/pokemon/${pokemon.name}`} className="pokemon-link">
                  <PokemonCardComponent 
                    pokemon={pokemon} 
                    toggleFavorite={toggleFavorite} 
                    isFavorite={true} 
                  />
                </Link>
              ) : (
                <div className="pokemon-card">
                  <h3>{pokemon.name}</h3>
                  <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
                  <motion.button 
                    onClick={() => toggleFavorite(pokemon.name)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="remove-favorite-button"
                  >
                    Remove from Favorites
                  </motion.button>
                  <Link to={`/pokemon/${pokemon.name}`} className="view-details-link">
                    View Details
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PokemonFavorites;
