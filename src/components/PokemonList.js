import React from 'react';
import { Link } from 'react-router-dom';

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
  normal: '#A8A878',
  alltype: '#F5F5F5'
};

const PokemonList = ({ pokemon, toggleFavorite, favoritePokemon }) => {
  return (
    <div className="pokemon-list">
      {pokemon.map((poke, index) => {
        // Check if types exist and have elements
        const mainType = poke.types && poke.types.length > 0 ? poke.types[0].type.name : 'alltype';

        return (
          <div 
            key={index} 
            className={`pokemon-card ${mainType}`} // Use mainType for the class
            style={{ backgroundColor: typeColors[mainType] || typeColors.alltype }} // Default to 'alltype' type color if undefined
          >
            <Link to={`/pokemon/${poke.name}`}>
              <img src={poke.image} alt={poke.name} className="pokemon-image" />
              <h3>{poke.name}</h3>
              <button onClick={() => toggleFavorite(poke.name)}>
                {favoritePokemon.includes(poke.name) ? '❤️' : '🤍'} {/* Heart toggle */}
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PokemonList;
