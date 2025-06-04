import React, { useState, useEffect, useContext } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';

// Register the required Chart.js components
Chart.register(...registerables);

// Fetch Pokémon list API
const fetchPokemonList = async () => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=250');
  const data = await response.json();
  return data.results.map(pokemon => pokemon.name);
};

// Fetch Pokémon by name API function
const fetchPokemonByName = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await response.json();
  return data;
};

const PokemonComparison = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState('');
  const [selectedPokemon2, setSelectedPokemon2] = useState('');
  const [pokemonData1, setPokemonData1] = useState(null);
  const [pokemonData2, setPokemonData2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    fetchData();
  }, []);

  const handleCompare = async () => {
    if (selectedPokemon1 && selectedPokemon2) {
      try {
        setIsLoading(true);
        setPokemonData1(null);
        setPokemonData2(null);
        
        const data1 = await fetchPokemonByName(selectedPokemon1.toLowerCase());
        const data2 = await fetchPokemonByName(selectedPokemon2.toLowerCase());

        setPokemonData1(data1);
        setPokemonData2(data2);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get primary type colors for Pokemon
  const getTypeColor = (pokemon) => {
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
    
    const type = pokemon.types[0].type.name;
    return typeColors[type] || '#A8A878';
  };
  
  const renderStatsComparison = () => {
    if (!pokemonData1 || !pokemonData2) return null;
    
    const color1 = getTypeColor(pokemonData1);
    const color2 = getTypeColor(pokemonData2);

    return (
      <motion.table 
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: isDarkMode ? 
            '0 8px 16px rgba(0, 0, 0, 0.3)' : 
            '0 8px 16px rgba(0, 0, 0, 0.1)',
          padding: '15px'
        }}
        variants={cardVariants}
      >
        <thead>
          <tr>
            <th style={{
              padding: '12px 15px',
              textAlign: 'left',
              color: isDarkMode ? '#fff' : '#333',
              borderBottom: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
            }}>Attribute</th>
            <th style={{
              padding: '12px 15px',
              textAlign: 'center',
              color: isDarkMode ? '#fff' : '#333',
              borderBottom: `2px solid ${color1}`,
              backgroundColor: `${color1}20`
            }}>
              {pokemonData1.name.charAt(0).toUpperCase() + pokemonData1.name.slice(1)}
            </th>
            <th style={{
              padding: '12px 15px',
              textAlign: 'center',
              color: isDarkMode ? '#fff' : '#333',
              borderBottom: `2px solid ${color2}`,
              backgroundColor: `${color2}20`
            }}>
              {pokemonData2.name.charAt(0).toUpperCase() + pokemonData2.name.slice(1)}
            </th>
          </tr>
        </thead>
        <tbody>
          {pokemonData1.stats.map((stat1, index) => {
            const stat1Value = stat1.base_stat;
            const stat2Value = pokemonData2.stats[index]?.base_stat || 0;
            const isHigher1 = stat1Value > stat2Value;
            const isHigher2 = stat2Value > stat1Value;
            
            return (
              <motion.tr 
                key={stat1.stat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: '8px'
                }}
              >
                <td style={{
                  padding: '10px 15px',
                  color: isDarkMode ? '#fff' : '#333',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {stat1.stat.name.replace('-', ' ')}
                </td>
                <td style={{
                  padding: '10px 15px',
                  textAlign: 'center',
                  color: isHigher1 ? color1 : (isDarkMode ? '#fff' : '#333'),
                  fontWeight: isHigher1 ? 'bold' : 'normal',
                  backgroundColor: isHigher1 ? `${color1}20` : 'transparent'
                }}>
                  {stat1.base_stat}
                </td>
                <td style={{
                  padding: '10px 15px',
                  textAlign: 'center',
                  color: isHigher2 ? color2 : (isDarkMode ? '#fff' : '#333'),
                  fontWeight: isHigher2 ? 'bold' : 'normal',
                  backgroundColor: isHigher2 ? `${color2}20` : 'transparent'
                }}>
                  {pokemonData2.stats[index]?.base_stat || 'N/A'}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
    );
  };

  const renderRadarChart = () => {
    if (!pokemonData1 || !pokemonData2) return null;
    
    const color1 = getTypeColor(pokemonData1);
    const color2 = getTypeColor(pokemonData2);

    const labels = pokemonData1.stats.map(stat => stat.stat.name.replace('-', ' ').toUpperCase());
    const data = {
      labels: labels,
      datasets: [
        {
          label: pokemonData1.name.charAt(0).toUpperCase() + pokemonData1.name.slice(1),
          data: pokemonData1.stats.map(stat => stat.base_stat),
          backgroundColor: `${color1}40`,
          borderColor: color1,
          borderWidth: 2,
          pointBackgroundColor: color1,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: color1,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: pokemonData2.name.charAt(0).toUpperCase() + pokemonData2.name.slice(1),
          data: pokemonData2.stats.map(stat => stat.base_stat),
          backgroundColor: `${color2}40`,
          borderColor: color2,
          borderWidth: 2,
          pointBackgroundColor: color2,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: color2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
      ],
    };

    const chartOptions = {
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          pointLabels: {
            color: isDarkMode ? '#e6e6e6' : '#333',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            backdropColor: isDarkMode ? 'rgba(26, 26, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? '#e6e6e6' : '#333',
            font: {
              size: 14,
              weight: 'bold'
            },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDarkMode ? '#fff' : '#333',
          bodyColor: isDarkMode ? '#e6e6e6' : '#666',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      }
    };

    return (
      <motion.div 
        className="radar-chart-container"
        style={{
          height: '400px',
          padding: '20px',
          backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          boxShadow: isDarkMode ? 
            '0 8px 16px rgba(0, 0, 0, 0.3)' : 
            '0 8px 16px rgba(0, 0, 0, 0.1)',
          marginTop: '20px'
        }}
        variants={cardVariants}
      >
        <Radar data={data} options={chartOptions} />
      </motion.div>
    );
  };

  return (
    <motion.div 
      className={`pokemon-comparison ${isDarkMode ? 'dark-mode' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: '20px',
        backgroundColor: isDarkMode ? 'rgba(26, 26, 46, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        borderRadius: '16px',
        boxShadow: isDarkMode ? 
          '0 10px 30px rgba(0, 0, 0, 0.3)' : 
          '0 10px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}
    >
      <motion.h2 
        variants={itemVariants}
        style={{
          color: isDarkMode ? '#ffcb05' : '#3c5aa6',
          textAlign: 'center',
          marginBottom: '30px',
          textShadow: isDarkMode ? 
            '0 0 10px rgba(255, 203, 5, 0.3)' : 
            '0 0 10px rgba(60, 90, 166, 0.3)'
        }}
      >
        Compare Pokémon
      </motion.h2>

      <motion.div 
        className="select-comparison"
        variants={itemVariants}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          justifyContent: 'center',
          marginBottom: '30px'
        }}
      >
        <motion.select
          value={selectedPokemon1}
          onChange={(e) => setSelectedPokemon1(e.target.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: isDarkMode ? '1px solid #3a3a50' : '1px solid #ddd',
            backgroundColor: isDarkMode ? '#2a2a40' : '#fff',
            color: isDarkMode ? '#e6e6e6' : '#333',
            fontSize: '16px',
            boxShadow: isDarkMode ? 
              '0 4px 8px rgba(0, 0, 0, 0.3)' : 
              '0 4px 8px rgba(0, 0, 0, 0.1)',
            flex: '1',
            minWidth: '200px',
            maxWidth: '300px'
          }}
        >
          <option value="">Select Pokémon 1</option>
          {pokemonList.map((name) => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </motion.select>

        <motion.select
          value={selectedPokemon2}
          onChange={(e) => setSelectedPokemon2(e.target.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: isDarkMode ? '1px solid #3a3a50' : '1px solid #ddd',
            backgroundColor: isDarkMode ? '#2a2a40' : '#fff',
            color: isDarkMode ? '#e6e6e6' : '#333',
            fontSize: '16px',
            boxShadow: isDarkMode ? 
              '0 4px 8px rgba(0, 0, 0, 0.3)' : 
              '0 4px 8px rgba(0, 0, 0, 0.1)',
            flex: '1',
            minWidth: '200px',
            maxWidth: '300px'
          }}
        >
          <option value="">Select Pokémon 2</option>
          {pokemonList.map((name) => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </motion.select>

        <motion.button 
          onClick={handleCompare}
          whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? '#ffcb05' : '#3c5aa6' }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedPokemon1 || !selectedPokemon2 || isLoading}
          style={{
            padding: '12px 30px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: isDarkMode ? '#3c5aa6' : '#ffcb05',
            color: isDarkMode ? '#fff' : '#333',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: isDarkMode ? 
              '0 4px 8px rgba(0, 0, 0, 0.3)' : 
              '0 4px 8px rgba(0, 0, 0, 0.1)',
            minWidth: '120px',
            opacity: (!selectedPokemon1 || !selectedPokemon2 || isLoading) ? 0.7 : 1
          }}
        >
          {isLoading ? 'Loading...' : 'Compare'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px'
            }}
          >
            <motion.div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '4px solid #f3f3f3',
                borderTop: `4px solid ${isDarkMode ? '#ffcb05' : '#3c5aa6'}`,
                animation: 'spin 1s linear infinite'
              }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </motion.div>
        )}

        {pokemonData1 && pokemonData2 && !isLoading && (
          <motion.div 
            className="comparison-result"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h3 
              variants={itemVariants}
              style={{
                textAlign: 'center',
                margin: '20px 0 30px',
                color: isDarkMode ? '#ffcb05' : '#3c5aa6',
                fontSize: '24px',
                textTransform: 'capitalize'
              }}
            >
              {pokemonData1.name} vs {pokemonData2.name}
            </motion.h3>
            
            <motion.div className="comparison-visuals" variants={itemVariants}>
              <div className="pokemon-images" style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <motion.div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={pokemonData1.sprites.other['official-artwork'].front_default || pokemonData1.sprites.front_default} 
                    alt={pokemonData1.name}
                    style={{
                      width: '150px',
                      height: '150px',
                      filter: isDarkMode ? 'drop-shadow(0 0 8px rgba(255, 203, 5, 0.5))' : 'drop-shadow(0 0 8px rgba(60, 90, 166, 0.5))'
                    }}
                  />
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    {pokemonData1.types.map(type => (
                      <span key={type.type.name} style={{
                        backgroundColor: getTypeColor(pokemonData1),
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img 
                    src={pokemonData2.sprites.other['official-artwork'].front_default || pokemonData2.sprites.front_default} 
                    alt={pokemonData2.name}
                    style={{
                      width: '150px',
                      height: '150px',
                      filter: isDarkMode ? 'drop-shadow(0 0 8px rgba(255, 203, 5, 0.5))' : 'drop-shadow(0 0 8px rgba(60, 90, 166, 0.5))'
                    }}
                  />
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    {pokemonData2.types.map(type => (
                      <span key={type.type.name} style={{
                        backgroundColor: getTypeColor(pokemonData2),
                        color: '#fff',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div className="comparison-tables" variants={itemVariants}>
              {renderStatsComparison()}
            </motion.div>
            
            <motion.div className="radar-chart" variants={itemVariants}>
              {renderRadarChart()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PokemonComparison;
