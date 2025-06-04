import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Chart from 'chart.js/auto';
import { ThemeContext } from '../contexts/ThemeContext';

// Type colors for Pokemon types
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
  normal: '#A8A878'
};

const EnhancedPokemonDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [selectedEvolution, setSelectedEvolution] = useState(null);
  
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2
      }
    }
  };
  
  const tabVariants = {
    inactive: { opacity: 0.7, scale: 0.95 },
    active: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };
  
  const evolutionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      }
    }),
    hover: { 
      scale: 1.1,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };
  
  // Fetch Pokemon data
  useEffect(() => {
    let isMounted = true;
    
    // Process evolution chain and fetch images for each evolution
    const processEvolutionChain = async (chain) => {
      const evolutions = [];
      
      // Process first Pokemon in the chain
      const firstPokemon = {
        name: chain.species.name,
        url: chain.species.url
      };
      
      // Add first Pokemon to the chain
      evolutions.push(await getPokemonDetails(firstPokemon));
      
      // Process the rest of the chain
      let currentEvolution = chain.evolves_to;
      
      while (currentEvolution.length > 0) {
        const evolution = currentEvolution[0];
        
        evolutions.push(await getPokemonDetails({
          name: evolution.species.name,
          url: evolution.species.url
        }));
        
        currentEvolution = evolution.evolves_to;
      }
      
      return evolutions;
    };
    
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch basic Pokemon data
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        
        if (isMounted) {
          const pokemonData = {
            id: response.data.id,
            name: response.data.name,
            height: response.data.height / 10, // convert to meters
            weight: response.data.weight / 10, // convert to kg
            types: response.data.types.map(typeInfo => ({
              type: typeInfo.type.name,
              color: typeColors[typeInfo.type.name] || '#A8A878'
            })),
            stats: response.data.stats.map(stat => ({
              name: stat.stat.name,
              value: stat.base_stat
            })),
            abilities: response.data.abilities.map(ability => ability.ability.name),
            sprites: {
              front: response.data.sprites.front_default,
              back: response.data.sprites.back_default,
              official: response.data.sprites.other['official-artwork'].front_default
            }
          };
          
          setPokemon(pokemonData);
          
          // Fetch species data to get evolution chain
          const speciesResponse = await axios.get(response.data.species.url);
          const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
          
          // Fetch evolution chain
          const evolutionResponse = await axios.get(evolutionChainUrl);
          const chain = evolutionResponse.data.chain;
          
          // Process evolution chain
          const processedChain = await processEvolutionChain(chain);
          
          if (isMounted) {
            setEvolutionChain(processedChain);
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching Pokemon data:', err);
          setError('Failed to load Pokemon data. Please try again.');
          setLoading(false);
        }
      }
    };
    
    fetchPokemonData();
    
    return () => {
      isMounted = false;
      // Clean up chart instance
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [name]);
  
  // Get Pokemon details including image
  const getPokemonDetails = async (pokemon) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      
      return {
        id: response.data.id,
        name: response.data.name,
        image: response.data.sprites.other['official-artwork'].front_default || response.data.sprites.front_default
      };
    } catch (err) {
      console.error(`Error fetching details for ${pokemon.name}:`, err);
      return {
        id: 0,
        name: pokemon.name,
        image: null
      };
    }
  };
  
  // Create or update chart when pokemon data changes
  useEffect(() => {
    if (!pokemon) return;
    
    const createChart = () => {
      const ctx = chartRef.current;
      if (!ctx) return;
      
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      // Create new chart
       chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: pokemon.stats.map(stat => {
            // Format stat names
            const statName = stat.name.replace(/-/g, ' ');
            return statName.charAt(0).toUpperCase() + statName.slice(1);
          }),
          datasets: [{
            label: 'Arcade Stats',
            data: pokemon.stats.map(stat => stat.value),
            backgroundColor: [
              '#00ffe7cc', // neon cyan
              '#ff00ccbb', // neon magenta
              '#ffe600cc', // neon yellow
              '#00ff1ecc', // neon green
              '#ff0033cc', // neon red
              '#3c5aa6cc'  // neon blue
            ],
            borderColor: '#fff',
            borderWidth: 3,
            borderRadius: 10,
            hoverBackgroundColor: '#fff',
            hoverBorderColor: '#ffcb05',
            maxBarThickness: 40
          }]
        },
        options: {
          scales: {
            x: {
              grid: {
                color: isDarkMode ? '#00ffe7' : '#3c5aa6',
                lineWidth: 2,
              },
              ticks: {
                color: isDarkMode ? '#fff' : '#222',
                font: {
                  size: 16,
                  weight: 'bold',
                  family: 'monospace'
                }
              },
              title: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: isDarkMode ? '#ff00cc' : '#ffcb05',
                lineWidth: 2,
              },
              ticks: {
                color: isDarkMode ? '#ffe600' : '#3c5aa6',
                font: {
                  size: 16,
                  weight: 'bold',
                  family: 'monospace'
                }
              },
              suggestedMax: 150
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: isDarkMode ? '#18182c' : '#fff',
              titleColor: isDarkMode ? '#00ffe7' : '#3c5aa6',
              bodyColor: isDarkMode ? '#ffe600' : '#222',
              borderColor: '#ff00cc',
              borderWidth: 2,
              titleFont: { size: 18, weight: 'bold', family: 'monospace' },
              bodyFont: { size: 16, weight: 'bold', family: 'monospace' },
              padding: 12
            }
          },
          layout: {
            padding: 20
          },
          animation: {
            duration: 1000,
            easing: 'easeOutBounce'
          },
          responsive: true,
          maintainAspectRatio: false,
          backgroundColor: isDarkMode ? '#18182c' : '#fff'
        }
      });
    };
    
    // Small timeout to ensure the canvas is in the DOM and properly sized
    setTimeout(() => {
      if (chartRef.current) {
        // Clear the canvas before creating a new chart
        const ctx = chartRef.current.getContext('2d');
        ctx && ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
      }
      createChart();
    }, 50);
    
  }, [pokemon, isDarkMode]); // Add isDarkMode as dependency
  
  // Handle evolution click
  const handleEvolutionClick = (evolution) => {
    setSelectedEvolution(evolution);
    
    // Navigate to the selected evolution after a short delay for animation
    setTimeout(() => {
      navigate(`/pokemon/${evolution.name}`);
    }, 500);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
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
          Loading Pokémon data...
        </motion.p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <motion.div 
        className="error-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="error-icon">❌</div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <motion.button
          className="back-button"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Back to PokéDex
        </motion.button>
      </motion.div>
    );
  }
  
  if (!pokemon) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="pokemon-detail-container"
        key={pokemon.id}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Back button */}
        <motion.button
          className="back-button"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={itemVariants}
        >
          ← Back to PokéDex
        </motion.button>
        
        {/* Pokemon header */}
        <motion.div className="pokemon-header" variants={itemVariants}>
          <div className="pokemon-id-name">
            <h2 style={{ color: isDarkMode ? '#333' : '#333' }}>#{pokemon.id.toString().padStart(3, '0')}</h2>
            <h1 style={{ color: isDarkMode ? '#333' : '#333' }}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
          </div>
          <div className="pokemon-types">
            {pokemon.types.map((type, index) => (
              <motion.span
                key={index}
                className="type-badge"
                style={{ 
                  backgroundColor: type.color,
                  boxShadow: isDarkMode ? '0 2px 8px rgba(255, 255, 255, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
              </motion.span>
            ))}
          </div>
        </motion.div>
        
        {/* Pokemon image and info card */}
        <div className="pokemon-content">
          <motion.div 
            className="pokemon-image-container"
            variants={itemVariants}
          >
            <motion.img
              src={pokemon.sprites.official || pokemon.sprites.front}
              alt={pokemon.name}
              variants={imageVariants}
              whileHover="hover"
            />
          </motion.div>
          
          <motion.div 
            className="pokemon-info-card"
            variants={cardVariants}
          >
            {/* Tabs */}
            <div className="pokemon-tabs" style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '20px',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: isDarkMode ? 
                '0 4px 8px rgba(255, 255, 255, 0.05)' : 
                '0 4px 8px rgba(0, 0, 0, 0.05)'
            }}>
              {['about', 'stats', 'evolution'].map((tab) => (
                <motion.button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                  variants={tabVariants}
                  initial="inactive"
                  animate={activeTab === tab ? "active" : "inactive"}
                  whileHover="hover"
                  style={{
                    backgroundColor: activeTab === tab ? 
                      (isDarkMode ? 'rgba(255, 255, 255, 0.2)' : pokemon.types[0].color + '30') : 
                      'transparent',
                    color: activeTab === tab ? 
                      (isDarkMode ? '#fff' : '#333') : 
                      (isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'),
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: activeTab === tab ? 'bold' : 'normal',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    boxShadow: activeTab === tab ? 
                      (isDarkMode ? '0 2px 8px rgba(255, 255, 255, 0.2)' : `0 2px 8px ${pokemon.types[0].color}40`) : 
                      'none'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </div>
            
            {/* Tab content */}
            <div className="tab-content">
              {/* About tab */}
              {activeTab === 'about' && (
                <motion.div 
                  className="about-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ padding: '15px 10px' }}
                >
                  <div className="pokemon-physical" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-around',
                    marginBottom: '20px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '12px',
                    padding: '15px',
                    boxShadow: isDarkMode ? 
                      '0 4px 8px rgba(255, 255, 255, 0.05)' : 
                      '0 4px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    <div className="physical-item" style={{ textAlign: 'center' }}>
                      <h3 style={{ 
                        color: isDarkMode ? '#fff' : '#333',
                        marginBottom: '8px',
                        fontSize: '16px'
                      }}>Height</h3>
                      <p style={{ 
                        color: isDarkMode ? '#fff' : '#333',
                        fontSize: '18px',
                        fontWeight: 'bold' 
                      }}>{pokemon.height} m</p>
                    </div>
                    <div className="physical-item" style={{ textAlign: 'center' }}>
                      <h3 style={{ 
                        color: isDarkMode ? '#fff' : '#333',
                        marginBottom: '8px',
                        fontSize: '16px'
                      }}>Weight</h3>
                      <p style={{ 
                        color: isDarkMode ? '#fff' : '#333',
                        fontSize: '18px',
                        fontWeight: 'bold' 
                      }}>{pokemon.weight} kg</p>
                    </div>
                  </div>
                  
                  <div className="pokemon-abilities" style={{ 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: '12px',
                    padding: '15px',
                    boxShadow: isDarkMode ? 
                      '0 4px 8px rgba(255, 255, 255, 0.05)' : 
                      '0 4px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    <h3 style={{ 
                      color: isDarkMode ? '#fff' : '#333',
                      marginBottom: '12px',
                      fontSize: '16px',
                      textAlign: 'center'
                    }}>Abilities</h3>
                    <div className="abilities-list" style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px',
                      justifyContent: 'center' 
                    }}>
                      {pokemon.abilities.map((ability, index) => (
                        <motion.div
                          key={index}
                          className="ability-item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          style={{ 
                            backgroundColor: pokemon.types[0].color + '40',
                            color: isDarkMode ? '#fff' : '#333',
                            padding: '8px 15px',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            boxShadow: `0 2px 6px ${pokemon.types[0].color}40`,
                            border: `1px solid ${pokemon.types[0].color}`
                          }}
                        >
                          {ability.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Stats tab */}
              {activeTab === 'stats' && (
                <motion.div 
                  className="stats-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginTop: 0, padding: '10px 0' }} /* Remove blank space */
                >
                  <div className="chart-container" style={{ marginBottom: '20px' }}>
                    <canvas ref={chartRef}></canvas>
                  </div>
                  
                  <div className="stats-list" style={{ padding: '0 10px' }}>
                    {pokemon.stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="stat-item"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ 
                          opacity: 1,
                          width: '100%',
                          transition: { delay: index * 0.1, duration: 0.5 }
                        }}
                        style={{ 
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div className="stat-name" style={{ 
                          color: isDarkMode ? '#fff' : '#333',
                          fontWeight: 'bold',
                          width: '120px',
                          marginRight: '10px'
                        }}>
                          {stat.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                        <div className="stat-value" style={{ 
                          color: isDarkMode ? '#fff' : '#333',
                          fontWeight: 'bold',
                          width: '40px',
                          textAlign: 'right',
                          marginRight: '10px'
                        }}>{stat.value}</div>
                        <div className="stat-bar-container" style={{
                          flex: 1,
                          height: '10px',
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: '5px',
                          overflow: 'hidden'
                        }}>
                          <motion.div
                            className="stat-bar"
                            style={{ 
                              backgroundColor: pokemon.types[0].color,
                              height: '100%',
                              boxShadow: isDarkMode ? '0 0 5px rgba(255, 255, 255, 0.5)' : '0 0 5px rgba(0, 0, 0, 0.3)'
                            }}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(stat.value / 255) * 100}%`,
                              transition: { delay: index * 0.1 + 0.2, duration: 0.5 }
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Evolution tab */}
              {activeTab === 'evolution' && (
                <motion.div 
                  className="evolution-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ padding: '10px 0' }}
                >
                  {evolutionChain.length > 0 ? (
                    <div className="evolution-chain" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}>
                      {evolutionChain.map((evolution, index) => (
                        <React.Fragment key={evolution.id}>
                          <motion.div
                            className={`evolution-item ${selectedEvolution?.id === evolution.id ? 'selected' : ''}`}
                            custom={index}
                            variants={evolutionVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleEvolutionClick(evolution)}
                            style={{
                              padding: '15px',
                              borderRadius: '12px',
                              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                              boxShadow: isDarkMode ? 
                                '0 4px 12px rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)' : 
                                '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div className="evolution-image" style={{ 
                              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.03)',
                              borderRadius: '50%',
                              padding: '10px',
                              marginBottom: '10px'
                            }}>
                              <img 
                                src={evolution.image} 
                                alt={evolution.name} 
                                style={{ width: '80px', height: '80px' }}
                              />
                            </div>
                            <div className="evolution-name" style={{ 
                              color: isDarkMode ? '#fff' : '#333',
                              fontWeight: 'bold',
                              fontSize: '16px'
                            }}>
                              {evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1)}
                            </div>
                          </motion.div>
                          
                          {/* Arrow between evolutions */}
                          {index < evolutionChain.length - 1 && (
                            <motion.div
                              className="evolution-arrow"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ 
                                opacity: 1, 
                                scale: 1,
                                transition: { delay: index * 0.1 + 0.2 }
                              }}
                              style={{
                                color: isDarkMode ? '#fff' : '#333',
                                fontSize: '24px',
                                margin: '0 10px',
                                fontWeight: 'bold'
                              }}
                            >
                              →
                            </motion.div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <div className="no-evolution" style={{ 
                      textAlign: 'center', 
                      padding: '20px',
                      color: isDarkMode ? '#fff' : '#333'
                    }}>
                      <p>This Pokémon does not evolve.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedPokemonDetail;
