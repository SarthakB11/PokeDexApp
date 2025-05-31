import React from 'react';
import { Link } from 'react-router-dom';

const PokemonFavorites = ({ favoritePokemon, toggleFavorite }) => {
  if (!favoritePokemon || favoritePokemon.length === 0) {
    return (
      <div>
        <h2>Favorites</h2>
        <p>No favorite Pokémon yet. Go back to the <Link to="/">home page</Link> to add some!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Favorites</h2>
      <div className="pokemon-list">
        {favoritePokemon.map((name) => (
          <div key={name} className="pokemon-card">
            <h3>{name}</h3>
            <button onClick={() => toggleFavorite(name)}>
              Remove from Favorites
            </button>
            <Link to={`/pokemon/${name}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonFavorites;
