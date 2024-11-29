import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemonData, setPokemonData] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [currentEvolutionIndex, setCurrentEvolutionIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setPokemonData(data);

      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      const chain = parseEvolutionChain(evolutionData.chain);
      setEvolutionChain(chain);
    };

    fetchPokemonDetail();
  }, [name]);

  const parseEvolutionChain = (chain) => {
    let evolutionStages = [];
    let currentStage = chain;

    while (currentStage) {
      evolutionStages.push(currentStage.species.name);
      currentStage = currentStage.evolves_to[0];
    }

    return evolutionStages;
  };

  const handleEvolve = async () => {
    if (currentEvolutionIndex < evolutionChain.length - 1) {
      setIsFlipped(true);
      const nextEvolutionIndex = currentEvolutionIndex + 1;
      const evolvedPokemonName = evolutionChain[nextEvolutionIndex];

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${evolvedPokemonName}`);
      const evolvedData = await response.json();

      setTimeout(() => {
        setPokemonData(evolvedData);
        setCurrentEvolutionIndex(nextEvolutionIndex);
        setIsFlipped(false);
      }, 600);
    }
  };

  if (!pokemonData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="pokemon-detail-container">
      <div className={`pokemon-detail-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="pokemon-detail-card-front">
          <h2 className="pokemon-name">{pokemonData.name}</h2>
          <img className="pokemon-image-detail" src={pokemonData.sprites.front_default} alt={pokemonData.name} />

          <h3>Stats</h3>
          <ul className="stats-list">
            {pokemonData.stats.map((stat) => (
              <li key={stat.stat.name}>
                <strong>{stat.stat.name}:</strong> {stat.base_stat}
              </li>
            ))}
          </ul>

          <h3>Abilities</h3>
          <ul className="abilities-list">
            {pokemonData.abilities.map((ability) => (
              <li key={ability.ability.name}>{ability.ability.name}</li>
            ))}
          </ul>

          <h3>Types</h3>
          <ul className="types-list">
            {pokemonData.types.map((type) => (
              <li key={type.type.name}>{type.type.name}</li>
            ))}
          </ul>
        </div>

        <div className="pokemon-detail-card-back">
          <h2>{pokemonData.name} - Evolved</h2>
          <img className="pokemon-image" src={pokemonData.sprites.front_default} alt={pokemonData.name} />
        </div>
      </div>

      {currentEvolutionIndex < evolutionChain.length - 1 && (
        <button className="evolve-button" onClick={handleEvolve}>
          Evolve
        </button>
      )}
    </div>
  );
};

export default PokemonDetail;
