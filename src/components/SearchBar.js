import React, { useState } from 'react';

const SearchBar = ({ onSearch, onTypeFilter, onSortOption, typeFilter, sortOption }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debounceSearch(value);
  };

  const debounceSearch = debounce((value) => {
    onSearch(value);
  }, 300);

  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const handleTypeChange = (e) => {
    onTypeFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    onSortOption(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <select value={typeFilter} onChange={handleTypeChange} className="type-filter">
        <option value="">All Types</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="grass">Grass</option>
        <option value="electric">Electric</option>
        <option value="psychic">Psychic</option>
        <option value="ice">Ice</option>
        <option value="rock">Rock</option>
        <option value="ghost">Ghost</option>
        <option value="dragon">Dragon</option>
        {/* Add more types as necessary */}
      </select>
      <select value={sortOption} onChange={handleSortChange} className="sort-option">
        <option value="name">Sort by Name</option>
        <option value="base_stat">Sort by Base Stat</option>
        {/* Add more sort options as necessary */}
      </select>
    </div>
  );
};

export default SearchBar;
