import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

const EnhancedNavigation = () => {
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/compare', label: 'Compare', icon: '⚖️' }
  ];
  
  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.1,
      backgroundColor: 'rgba(255, 203, 5, 0.2)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };
  
  const pokeballVariants = {
    initial: { rotate: 0 },
    hover: { 
      rotate: 360,
      transition: { 
        duration: 1,
        ease: "easeInOut"
      }
    }
  };
  
  const indicatorVariants = {
    initial: { width: 0, opacity: 0 },
    active: { 
      width: '100%', 
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <motion.nav 
      className={`enhanced-navigation ${isDarkMode ? 'dark' : 'light'}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="nav-title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        PokéDex
      </motion.h2>
      
      <div className="nav-items">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoverIndex(index)}
              onHoverEnd={() => setHoverIndex(null)}
            >
              <Link to={item.path} className="nav-link">
                <motion.span 
                  className="nav-icon"
                  animate={{ 
                    scale: hoverIndex === index ? [1, 1.2, 1] : 1,
                    rotate: hoverIndex === index ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.span>
                <span className="nav-label">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div 
                    className="active-indicator"
                    variants={indicatorVariants}
                    initial="initial"
                    animate="active"
                    layoutId="activeNavIndicator"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      {/* Dark Mode Toggle Button */}
      <motion.div 
        className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="toggle-thumb"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="toggle-icon">
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
};

export default EnhancedNavigation;
