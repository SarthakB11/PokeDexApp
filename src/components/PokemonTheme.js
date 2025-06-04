import React from 'react';
import { motion } from 'framer-motion';
import { typeColors, pokemonFloating, pokeballSpin } from '../utils/animations';

// Pokeball loader component
export const PokeballLoader = ({ size = 50 }) => {
  return (
    <motion.div
      className="pokeball-loader"
      style={{ width: size, height: size }}
      variants={pokeballSpin}
      initial="initial"
      animate="animate"
    >
      <div className="pokeball-top"></div>
      <div className="pokeball-bottom"></div>
      <div className="pokeball-center"></div>
    </motion.div>
  );
};

// Type Badge component
export const TypeBadge = ({ type }) => {
  const bgColor = typeColors[type.toLowerCase()] || '#A8A878';
  
  return (
    <motion.span
      className="type-badge"
      style={{ backgroundColor: bgColor }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {type}
    </motion.span>
  );
};

// Pokemon Card with animation
export const AnimatedPokemonCard = ({ pokemon, isFavorite, onToggleFavorite }) => {
  const mainType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : 'normal';
  const bgColor = typeColors[mainType] || typeColors.normal;

  return (
    <motion.div
      className={`pokemon-card ${mainType}`}
      style={{ backgroundColor: bgColor }}
      variants={pokemonFloating}
      initial="initial"
      animate="animate"
      whileHover={{ 
        scale: 1.05, 
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
        transition: { duration: 0.2 }
      }}
    >
      <motion.img 
        src={pokemon.image} 
        alt={pokemon.name} 
        className="pokemon-image"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
      <h3>{pokemon.name}</h3>
      <motion.button
        className="favorite-button"
        onClick={() => onToggleFavorite(pokemon.name)}
        whileTap={{ scale: 0.9 }}
      >
        {isFavorite ? '❤️' : '🤍'}
      </motion.button>
    </motion.div>
  );
};

// Animated Title
export const AnimatedTitle = ({ text, className = "" }) => {
  return (
    <motion.h1
      className={`animated-title ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.h1>
  );
};

// Animated Button
export const PokemonButton = ({ children, onClick, type = "normal" }) => {
  const bgColor = typeColors[type] || typeColors.normal;
  
  return (
    <motion.button
      className="pokemon-button"
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Animated Navigation Link
export const NavLink = ({ to, children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="nav-link-container"
    >
      <a href={to} className="nav-link">
        {children}
      </a>
    </motion.div>
  );
};
