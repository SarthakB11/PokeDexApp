import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navigation = () => {
  return (
    <motion.nav 
      className="pokemon-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <motion.div 
          className="pokeball-icon"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pokeball-top"></div>
          <div className="pokeball-bottom"></div>
          <div className="pokeball-center"></div>
        </motion.div>
        
        <div className="nav-links">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="nav-link">Home</Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/favorites" className="nav-link">Favorites</Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/compare" className="nav-link">Compare</Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
