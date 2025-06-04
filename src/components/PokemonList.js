import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const typeColors = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
  steel: '#B8B8D0',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  bug: '#A8B820',
  fighting: '#C03028',
  normal: '#A8A878',
  alltype: '#F5F5F5'
};

const PokemonList = ({ pokemonList, toggleFavorite, favoritePokemon, PokemonCardComponent }) => {
  // Use the enhanced card component if provided, otherwise use the default card rendering
  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation
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

  return (
    <motion.div 
      className="pokemon-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {pokemonList && pokemonList.map((pokemon) => {
        const mainType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : 'normal';
        const isFavorite = favoritePokemon.includes(pokemon.name);
        
        // If an enhanced card component is provided, use it
        if (PokemonCardComponent) {
          return (
            <motion.div 
              key={pokemon.name} 
              variants={itemVariants}
              onClick={() => window.location.hash = `#/pokemon/${pokemon.name}`}
            >
              <PokemonCardComponent 
                pokemon={pokemon} 
                toggleFavorite={toggleFavorite} 
                isFavorite={isFavorite} 
              />
            </motion.div>
          );
        }
        
        // Otherwise use the default card rendering
        return (
          <motion.div 
            key={pokemon.name} 
            className="pokemon-card"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            style={{ backgroundColor: typeColors[mainType] || typeColors.normal }}
          >
            <motion.button 
              className="favorite-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(pokemon.name);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </motion.button>
            
            <div 
              className="pokemon-card-content"
              onClick={() => window.location.hash = `#/pokemon/${pokemon.name}`}
              style={{ cursor: 'pointer' }}
            >
              <div className="pokemon-image-container">
                <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
              </div>
              <div className="pokemon-info">
                <h3 className="pokemon-name">{pokemon.name}</h3>
                <div className="pokemon-types">
                  {pokemon.types && pokemon.types.map((typeInfo, index) => (
                    <span 
                      key={index} 
                      className="type-badge"
                      style={{ 
                        backgroundColor: `${typeColors[typeInfo.type.name]}80` || typeColors.normal 
                      }}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PokemonList;
