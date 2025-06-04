import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchPokemonList, fetchPokemonByType } from './services/api'; // Make sure to import the function
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Slider from './components/Slider'; // Import the slider component
import PokemonFavorites from './components/PokemonFavorites';
import PokemonComparison from './components/PokemonComparison'; // Import the PokemonComparison component

// Import enhanced components
import EnhancedPokemonCard from './components/EnhancedPokemonCard';
import EnhancedPokemonDetail from './components/EnhancedPokemonDetail';
import EnhancedNavigation from './components/EnhancedNavigation';

// Import theme provider
import { ThemeProvider } from './contexts/ThemeContext';

import './App.css';
import './styles/PokemonTheme.css'; // Import the Pokemon theme CSS
import './styles/EnhancedPokemonDetail.css'; // Import enhanced detail styles
import './styles/EnhancedNavigation.css'; // Import enhanced navigation styles
import './styles/EnhancedFavorites.css'; // Import enhanced favorites styles
import './styles/DarkMode.css'; // Import dark mode styles

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const sliderImages = [
    '/PokeDexApp/images/pokeball.jpg',
    '/PokeDexApp/images/pikachu.jpg',
    '/PokeDexApp/images/charizard.jpg',
  ];

  // Page transition variants
  const pageTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPokemonList();
        
        // Process the data to ensure each Pokemon has an image property
        const processedData = data.map(pokemon => {
          // Extract ID for image URL
          let pokemonId;
          if (pokemon.id) {
            pokemonId = pokemon.id;
          } else if (pokemon.url) {
            const urlParts = pokemon.url.split('/');
            pokemonId = urlParts[urlParts.length - 2] || '1';
          } else {
            pokemonId = '1';
          }
          
          // Add image property if it doesn't exist
          if (!pokemon.image) {
            return {
              ...pokemon,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
            };
          }
          return pokemon;
        });
        
        setPokemonList(processedData);
        setFilteredPokemon(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
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


  // Calculate current Pokemon list based on pagination
  const indexOfLastPokemon = currentPage * pokemonPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    // Set the current page without any side effects that might reset it
    setCurrentPage(pageNumber);
    
    // Scroll to top after page change
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // These handlers are used in the SearchBar component
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    filterAndSortPokemon(searchTerm, typeFilter, sortOption);
  };

  const handleSortOption = (sort) => {
    setSortOption(sort);
    filterAndSortPokemon(searchTerm, typeFilter, sort);
  };

  const handleTypeFilter = async (type) => {
    setIsLoading(true);
    
    // Only reset page if the filter is actually changing
    const isChangingFilter = type !== typeFilter;
    
    setTypeFilter(type);
    
    if (type !== 'all') {
      const pokemonByType = await fetchPokemonByType(type);
      setFilteredPokemon(pokemonByType);
      // Only reset to page 1 if the filter is changing
      if (isChangingFilter) {
        setCurrentPage(1);
      }
    } else {
      setFilteredPokemon(pokemonList); // Reset to original list if "All Types" is selected
      // Only reset to page 1 if the filter is changing
      if (isChangingFilter) {
        setCurrentPage(1);
      }
    }
    setIsLoading(false);
  };

  const filterAndSortPokemon = (search, type, sort) => {
    let filtered = pokemonList;

    // Filter by search term
    if (search) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort the results
    filtered.sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Assuming base_stat is available in the data
      return (a.base_stat || 0) - (b.base_stat || 0);
    });

    setFilteredPokemon(filtered);
    // Only reset page to 1 when search or filter changes, not during normal pagination
    if (search !== searchTerm || type !== typeFilter || sort !== sortOption) {
      setCurrentPage(1);
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <motion.div 
            className="heading"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <h1>PokeDex</h1>
          </motion.div>
          
          <EnhancedNavigation />
          
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    key="home"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                  >
                    <Slider images={sliderImages} />
                    <div className="search-and-filter">
                      <SearchBar 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        typeFilter={typeFilter} 
                        setTypeFilter={setTypeFilter}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        handleSearch={handleSearch}
                        handleTypeFilter={handleTypeFilter}
                        handleSortOption={handleSortOption}
                      />
                    </div>
                    {isLoading ? (
                      <motion.div 
                        className="loading-container"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          transition: { duration: 0.5 }
                        }}
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
                          Loading Pokémon...
                        </motion.p>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          className="pokemon-list-container"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { duration: 0.5 }
                          }}
                        >
                          <PokemonList 
                            pokemonList={currentPokemon} 
                            toggleFavorite={toggleFavorite}
                            favoritePokemon={favoritePokemon}
                            PokemonCardComponent={EnhancedPokemonCard}
                          />
                        </motion.div>
                        <Pagination 
                          totalPokemon={filteredPokemon.length} 
                          pokemonPerPage={pokemonPerPage} 
                          currentPage={currentPage}
                          setCurrentPage={handlePageChange}
                        />
                      </>
                    )}
                  </motion.div>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <motion.div
                    key="favorites"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                  >
                    <PokemonFavorites 
                      favoritePokemon={favoritePokemon} 
                      toggleFavorite={toggleFavorite} 
                      PokemonCardComponent={EnhancedPokemonCard}
                    />
                  </motion.div>
                } 
              />
              <Route 
                path="/compare" 
                element={
                  <motion.div
                    key="compare"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                  >
                    <PokemonComparison favoritePokemon={favoritePokemon} />
                  </motion.div>
                } 
              />
              <Route 
                path="/pokemon/:name" 
                element={
                  <motion.div
                    key="detail"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                  >
                    <EnhancedPokemonDetail />
                  </motion.div>
                } 
              /> 
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
