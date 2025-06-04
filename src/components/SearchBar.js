import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ 
  searchTerm: propSearchTerm, 
  setSearchTerm: propSetSearchTerm,
  typeFilter, 
  setTypeFilter,
  sortOption,
  setSortOption,
  handleSearch,
  handleTypeFilter,
  handleSortOption
}) => {
  const [searchTerm, setSearchTerm] = useState(propSearchTerm || '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Pokémon types for the filter dropdown
  const pokemonTypes = [
    'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  // Sort options
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'id', label: 'ID (Low-High)' }
  ];

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Pass the debounced search term to the parent component
  useEffect(() => {
    if (handleSearch) {
      handleSearch(debouncedSearchTerm);
    } else if (propSetSearchTerm) {
      propSetSearchTerm(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch, propSetSearchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Also update parent's state if propSetSearchTerm is provided
    if (propSetSearchTerm) {
      propSetSearchTerm(e.target.value);
    }
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value === 'all' ? '' : e.target.value;
    if (handleTypeFilter) {
      handleTypeFilter(selectedType);
    } else if (setTypeFilter) {
      setTypeFilter(selectedType);
    }
  };

  const handleSortChange = (e) => {
    if (handleSortOption) {
      handleSortOption(e.target.value);
    } else if (setSortOption) {
      setSortOption(e.target.value);
    }
  };

  return (
    <motion.div 
      className="search-bar-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="search-controls">
        <motion.div 
          className="search-input-container"
          whileHover={{ scale: 1.02 }}
        >
          <div className="search-input-wrapper">
            <motion.div
              className="search-input-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <motion.span
                className="search-icon-inside"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}
              >
                🔍
              </motion.span>
              <motion.input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                initial={{ width: '100%' }}
                whileFocus={{ boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}
                style={{
                  paddingLeft: '40px',
                  borderRadius: '30px',
                  border: '2px solid #3c5aa6',
                  padding: '12px 20px 12px 40px',
                  fontSize: '16px',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="filter-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="type-filter"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, #3c5aa6 0%, #2a75bb 100%)',
              borderRadius: '20px',
              padding: '8px 16px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <label 
              htmlFor="type-filter"
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Type:
            </label>
            <select 
              id="type-filter" 
              value={typeFilter || 'all'} 
              onChange={handleTypeChange}
              className="filter-select modern-select"
              style={{
                background: 'rgba(32, 63, 121, 0.9)',
                border: 'none',
                borderRadius: '15px',
                padding: '8px 12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px top 50%',
                backgroundSize: '10px auto',
                paddingRight: '30px'
              }}
            >
              {pokemonTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div 
            className="sort-option"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, #ffcb05 0%, #ff9800 100%)',
              borderRadius: '20px',
              padding: '8px 16px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <label 
              htmlFor="sort-option"
              style={{
                color: '#333',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Sort by:
            </label>
            <select 
              id="sort-option" 
              value={sortOption} 
              onChange={handleSortChange}
              className="filter-select modern-select"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '15px',
                padding: '8px 12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px top 50%',
                backgroundSize: '10px auto',
                paddingRight: '30px'
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>
        </motion.div>
      </div>

      {searchTerm && (
        <motion.div 
          className="search-info"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Searching for: <span className="search-term">{searchTerm}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;
