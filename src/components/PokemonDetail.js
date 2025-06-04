import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart } from 'chart.js/auto';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Fetch Pokemon data and evolution chain
  useEffect(() => {
    let isMounted = true;
    
    const fetchPokemonData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = response.data;
        
        // Fetch species data to get evolution chain URL
        const speciesResponse = await axios.get(pokemonData.species.url);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
        
        // Fetch evolution chain data
        const evolutionResponse = await axios.get(evolutionChainUrl);
        const evolutionData = evolutionResponse.data;
        
        // Process evolution chain
        const chain = [];
        let currentEvolution = evolutionData.chain;
        
        // Add base form
        chain.push({
          name: currentEvolution.species.name,
          url: `https://pokeapi.co/api/v2/pokemon/${currentEvolution.species.name}`
        });
        
        // Add evolutions
        while (currentEvolution.evolves_to.length > 0) {
          currentEvolution = currentEvolution.evolves_to[0];
          chain.push({
            name: currentEvolution.species.name,
            url: `https://pokeapi.co/api/v2/pokemon/${currentEvolution.species.name}`
          });
        }
        
        // Fetch image URLs for each evolution
        const evolutionWithImages = await Promise.all(
          chain.map(async (evo) => {
            const evoResponse = await axios.get(evo.url);
            return {
              ...evo,
              image: evoResponse.data.sprites.other['official-artwork'].front_default || evoResponse.data.sprites.front_default
            };
          })
        );
        
        if (isMounted) {
          setPokemon(pokemonData);
          setEvolutionChain(evolutionWithImages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchPokemonData();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      // Destroy chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [name]);
  
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
        type: 'radar',
        data: {
          labels: pokemon.stats.map(stat => stat.stat.name),
          datasets: [{
            label: 'Stats',
            data: pokemon.stats.map(stat => stat.base_stat),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 150
            }
          }
        }
      });
    };
    
    // Small timeout to ensure the canvas is in the DOM
    const timer = setTimeout(() => {
      createChart();
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [pokemon]);
  
  const handleEvolve = (evoPokemon) => {
    setIsFlipped(true);
    setTimeout(() => {
      window.location.href = `/#/pokemon/${evoPokemon.name}`;
      window.location.reload();
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="pokemon-detail-loading">
        <motion.div 
          className="pokeball-loader"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
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
  
  if (!pokemon) {
    return (
      <div className="pokemon-detail-error">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pokémon not found!
        </motion.h2>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/" className="back-button">Return to PokéDex</Link>
        </motion.div>
      </div>
    );
  }
  
  const mainType = pokemon.types[0].type.name;
  
  return (
    <AnimatePresence>
      <motion.div 
        className={`pokemon-detail-container ${mainType}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`pokemon-detail-card ${isFlipped ? 'flipped' : ''}`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="card-front">
            <motion.div 
              className="pokemon-detail-header"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1>{pokemon.name}</h1>
              <div className="pokemon-id">#{pokemon.id}</div>
            </motion.div>
            
            <div className="pokemon-detail-content">
              <motion.div 
                className="pokemon-image-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
                  alt={pokemon.name}
                  className="pokemon-detail-image"
                />
              </motion.div>
              
              <motion.div 
                className="pokemon-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="pokemon-types">
                  {pokemon.types.map((typeInfo, index) => (
                    <motion.span 
                      key={index} 
                      className={`type-badge ${typeInfo.type.name}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {typeInfo.type.name}
                    </motion.span>
                  ))}
                </div>
                
                <motion.div 
                  className="pokemon-physical"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p>Height: {pokemon.height / 10}m</p>
                  <p>Weight: {pokemon.weight / 10}kg</p>
                </motion.div>
                
                <motion.div 
                  className="pokemon-abilities"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3>Abilities:</h3>
                  <ul>
                    {pokemon.abilities.map((ability, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                      >
                        {ability.ability.name} {ability.is_hidden && '(Hidden)'}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              className="pokemon-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3>Stats:</h3>
              <div className="chart-container">
                <canvas ref={chartRef} />
              </div>
            </motion.div>
            
            {evolutionChain.length > 1 && (
              <motion.div 
                className="pokemon-evolution"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3>Evolution Chain:</h3>
                <div className="evolution-chain">
                  {evolutionChain.map((evo, index) => (
                    <React.Fragment key={index}>
                      <motion.div 
                        className={`evolution-item ${evo.name === pokemon.name ? 'current' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => evo.name !== pokemon.name && handleEvolve(evo)}
                      >
                        <img src={evo.image} alt={evo.name} />
                        <p>{evo.name}</p>
                      </motion.div>
                      {index < evolutionChain.length - 1 && (
                        <motion.div 
                          className="evolution-arrow"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          →
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        <motion.div
          className="back-link-container"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link to="/" className="back-button">← Back to PokéDex</Link>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PokemonDetail;
