import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

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

const EnhancedPokemonCard = ({ pokemon, toggleFavorite, isFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const mainType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0].type.name : 'alltype';
  
  // Add a random delay for staggered animations
  const randomDelay = Math.random() * 0.5;
  
  // Calculate a lighter and darker shade for the card gradient
  const lighterShade = (hex) => {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Lighten by 30%
    r = Math.min(255, r + 77);
    g = Math.min(255, g + 77);
    b = Math.min(255, b + 77);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  const darkerShade = (hex) => {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Darken by 20%
    r = Math.max(0, r - 51);
    g = Math.max(0, g - 51);
    b = Math.max(0, b - 51);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  const cardColor = typeColors[mainType] || typeColors.alltype;
  const cardLighterColor = lighterShade(cardColor);
  const cardDarkerColor = darkerShade(cardColor);
  
  // Animation variants
  const cardVariants = {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: randomDelay,
        ease: [0.43, 0.13, 0.23, 0.96] 
      } 
    },
    hover: { 
      scale: 1.05, 
      boxShadow: `0 15px 30px rgba(0, 0, 0, 0.3), 0 0 0 2px ${cardColor}`,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };
  
  const imageVariants = {
    initial: { y: 0, scale: 1 },
    hover: { 
      y: -10, 
      scale: 1.1,
      transition: { 
        y: { yoyo: Infinity, duration: 2, ease: "easeInOut" },
        scale: { duration: 0.3 }
      } 
    }
  };
  
  const nameVariants = {
    initial: { y: 0, opacity: 0.9 },
    hover: { 
      y: -5, 
      opacity: 1,
      transition: { duration: 0.3 } 
    }
  };
  
  const typeBadgeVariants = {
    initial: { scale: 1, opacity: 0.9 },
    hover: { 
      scale: 1.1, 
      opacity: 1,
      transition: { 
        duration: 0.2,
        delay: 0.1
      } 
    }
  };
  
  const favoriteVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.2, 
      rotate: isFavorite ? [0, -10, 10, -10, 10, 0] : 0,
      transition: { 
        duration: 0.4,
        rotate: { duration: 0.6, ease: "easeInOut" }
      } 
    },
    tap: { scale: 0.9, transition: { duration: 0.1 } }
  };
  
  const statsVariants = {
    initial: { opacity: 0, height: 0 },
    hover: { 
      opacity: 1, 
      height: 'auto', 
      transition: { duration: 0.4, delay: 0.2 } 
    }
  };
  
  const shimmerVariants = {
    initial: { x: '-100%', opacity: 0 },
    animate: { 
      x: '100%', 
      opacity: [0, 0.5, 0],
      transition: { 
        repeat: Infinity, 
        repeatDelay: 5,
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      className={`pokemon-card ${isDarkMode ? 'dark-mode' : ''}`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onHoverStart={() => {
        setIsHovered(true);
        setIsAnimating(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setTimeout(() => setIsAnimating(false), 300);
      }}
      style={{
        background: `linear-gradient(135deg, ${cardColor} 0%, ${cardLighterColor} 100%)`,
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        boxShadow: isHovered 
          ? `0 15px 30px rgba(0, 0, 0, 0.25), 0 0 0 2px ${cardColor}` 
          : isDarkMode 
            ? `0 6px 12px rgba(255, 255, 255, 0.1)` 
            : `0 6px 12px rgba(0, 0, 0, 0.1)`,
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer'
      }}
    >
        {/* Shimmer Effect */}
        <motion.div
          className="shimmer-effect"
          variants={shimmerVariants}
          initial="initial"
          animate={isAnimating ? "animate" : "initial"}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'}, transparent)`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        {/* Pokemon ID Badge */}
        <motion.div 
          className="pokemon-id"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: randomDelay + 0.2, duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(255, 255, 255, 0.4)',
            padding: '4px 10px',
            borderRadius: '14px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            zIndex: 2,
            backdropFilter: 'blur(5px)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          #{pokemon.id ? String(pokemon.id).padStart(3, '0') : '000'}
        </motion.div>

        {/* Favorite Button */}
        <motion.div 
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFavorite(pokemon.name);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          variants={favoriteVariants}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: randomDelay + 0.3, duration: 0.4, type: 'spring' }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            cursor: 'pointer',
            fontSize: '1.5rem',
            background: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(5px)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </motion.div>

        {/* Pokemon Image */}
        <motion.div 
          className="pokemon-image-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '25px 0',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            className="image-backdrop"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: randomDelay + 0.1, duration: 0.5 }}
            style={{ 
              position: 'absolute',
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              backgroundColor: `${cardDarkerColor}40`,
              filter: 'blur(10px)',
              zIndex: 1,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease-out'
            }}
          />
          <motion.img
            src={
              // Use a simple, direct approach that works reliably
              (() => {
                // Get Pokemon ID from URL or directly
                let id = '1';
                if (pokemon.id) {
                  id = pokemon.id;
                } else if (pokemon.url) {
                  const parts = pokemon.url.split('/');
                  id = parts[parts.length - 2] || '1';
                }
                
                // Always use this reliable URL pattern
                return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
              })()
            }
            alt={pokemon.name}
            variants={imageVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: randomDelay + 0.2, duration: 0.5 }}
            style={{ 
              width: '130px', 
              height: '130px',
              objectFit: 'contain',
              zIndex: 2,
              filter: isDarkMode 
                ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))' 
                : 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))'
            }}
          />
        </motion.div>

        {/* Pokemon Details */}
        <motion.div 
          className="pokemon-details"
          style={{
            padding: '0 15px 15px',
            textAlign: 'center'
          }}
        >
          <motion.h3 
            className="pokemon-name"
            variants={nameVariants}
            style={{
              margin: '0 0 10px',
              color: isDarkMode ? '#fff' : '#333',
              textShadow: isDarkMode ? '0 1px 2px rgba(0, 0, 0, 0.8)' : 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}
          >
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </motion.h3>
          
          <motion.div 
            className="pokemon-types"
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '12px'
            }}
          >
            {pokemon.types && Array.isArray(pokemon.types) && pokemon.types.map(typeInfo => (
              <motion.span 
                key={typeInfo.type.name} 
                className={`type-badge ${typeInfo.type.name}`}
                style={{ 
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  backgroundColor: typeColors[typeInfo.type.name] || '#A8A878',
                  color: '#fff',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
                whileHover={{ scale: 1.1, y: -2 }}
                variants={typeBadgeVariants}
              >
                {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Base Stats Preview on Hover */}
          <motion.div 
            className="stats-preview"
            variants={statsVariants}
            style={{
              overflow: 'hidden'
            }}
          >
            {pokemon.stats && Array.isArray(pokemon.stats) && pokemon.stats.slice(0, 3).map((stat, index) => (
              <div 
                key={stat.stat.name} 
                className="stat-bar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '5px',
                  fontSize: '0.7rem'
                }}
              >
                <div 
                  className="stat-name"
                  style={{
                    width: '60px',
                    textAlign: 'right',
                    marginRight: '8px',
                    fontWeight: 'bold',
                    color: isDarkMode ? '#555' : '#555',
                    textTransform: 'capitalize'
                  }}
                >
                  {stat.stat.name.replace('-', ' ')}:
                </div>
                <div 
                  className="stat-bar-container"
                  style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div 
                    className="stat-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.base_stat / 255) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    style={{
                      height: '100%',
                      backgroundColor: cardColor,
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div 
                  className="stat-value"
                  style={{
                    width: '30px',
                    textAlign: 'right',
                    marginLeft: '8px',
                    fontWeight: 'bold',
                    color: isDarkMode ? '#333' : '#333'
                  }}
                >
                  {stat.base_stat}
                </div>
              </div>
            ))}
            <motion.div 
              className="view-more"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                textAlign: 'center',
                fontSize: '0.8rem',
                marginTop: '8px',
                color: isDarkMode ? '#aaa' : '#666',
                fontStyle: 'italic'
              }}
            >
              Click for more details...
            </motion.div>
          </motion.div>
        </motion.div>
    </motion.div>
  );
};

export default EnhancedPokemonCard;
