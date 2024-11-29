// components/PokemonFavorites.js
import React from 'react';

const PokemonFavorites = ({ favoritePokemon }) => {
  return (
    <div className="pokemon-favorites">
      <h2>Your Favorite Pokémon</h2>
      {favoritePokemon.length === 0 ? (
        <p>You have no favorite Pokémon.</p>
      ) : (
        <ul>
          {favoritePokemon.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PokemonFavorites;
