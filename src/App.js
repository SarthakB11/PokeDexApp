import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { fetchPokemonList, fetchPokemonByType } from './services/api'; // Make sure to import the function
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import PokemonDetail from './components/PokemonDetail'; // Import the detail page
import Slider from './components/Slider'; // Import the slider component
import PokemonOrigins from './components/PokemonOrigins'; // Import the origins component
import PokemonFavorites from './components/PokemonFavorites';
import PokemonComparison from './components/PokemonComparison'; // Import the PokemonComparison component
import Navigation from './components/Navigation';

import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const sliderImages = [
    '/PokeDexApp/images/pokeball.jpg',
    '/PokeDexApp/images/pikachu.jpg',
    '/PokeDexApp/images/charizard.jpg',
  ];

  useEffect(() => {
    const loadPokemon = async () => {
      const data = await fetchPokemonList();
      setPokemonList(data);
      setFilteredPokemon(data); // Initially, show all Pokémon
    };
    loadPokemon();

     // Load favorites from localStorage
     const savedFavorites = JSON.parse(localStorage.getItem('favoritePokemon')) || [];
     setFavoritePokemon(savedFavorites);
  }, []);

  const toggleFavorite = (name) => {
    let updatedFavorites = [...favoritePokemon];

    if (favoritePokemon.includes(name)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== name);
    } else {
      updatedFavorites.push(name);
    }

    setFavoritePokemon(updatedFavorites);
    localStorage.setItem('favoritePokemon', JSON.stringify(updatedFavorites)); // Save to localStorage
  };


  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    filterAndSortPokemon(searchTerm, typeFilter, sortOption);
  };

  const handleTypeFilter = async (type) => {
    setTypeFilter(type);
    if (type) {
      const pokemonByType = await fetchPokemonByType(type);
      setFilteredPokemon(pokemonByType);
    } else {
      setFilteredPokemon(pokemonList); // Reset to original list if "All Types" is selected
    }
    setCurrentPage(1); // Reset to the first page on new filter
  };

  const handleSortOption = (sort) => {
    setSortOption(sort);
    filterAndSortPokemon(searchTerm, typeFilter, sort);
  };

  const filterAndSortPokemon = (searchTerm, typeFilter, sortOption) => {
    let filtered = pokemonList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort the results
    filtered.sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Assuming base_stat is available in the data
      return (a.base_stat || 0) - (b.base_stat || 0);
    });

    setFilteredPokemon(filtered);
    setCurrentPage(1); // Reset to the first page on new filter/sort
  };

  return (
    <Router>
      <div className="app">
        <div className="heading">
          <h1>PokeDex</h1>
        </div>
        <Navigation /> {/* Add the Navigation component here */}
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Slider images={sliderImages} />
                <SearchBar 
                  onSearch={handleSearch} 
                  onTypeFilter={handleTypeFilter}
                  onSortOption={handleSortOption}
                  typeFilter={typeFilter}
                  sortOption={sortOption}
                />
                <PokemonList 
                  pokemon={currentPokemon}
                  toggleFavorite={toggleFavorite} 
                  favoritePokemon={favoritePokemon} 
                />
                <Pagination
                  pokemonPerPage={pokemonPerPage}
                  totalPokemon={filteredPokemon.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
                <PokemonOrigins pokemonList={filteredPokemon} />
              </>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <PokemonFavorites 
                favoritePokemon={favoritePokemon}
                toggleFavorite={toggleFavorite} // Pass this if needed
              />
            } 
          />
          <Route path="/compare" element={<PokemonComparison />} />
          <Route path="/pokemon/:name" element={<PokemonDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
