import axios from 'axios';

const API_BASE_URL = 'https://pokeapi.co/api/v2/';

// Fetch the list of Pokémon with detailed information (including their sprites and origin story)
export const fetchPokemonList = async () => {
  const response = await fetch(`${API_BASE_URL}pokemon?limit=250`); // Fetch first 250 Pokémon
  const data = await response.json();

  // Fetch detailed information for each Pokémon (including their sprites and species data)
  const detailedPokemonPromises = data.results.map(async (pokemon, index) => {
    const pokemonDetailResponse = await fetch(pokemon.url); // Fetch individual Pokémon details
    const pokemonDetailData = await pokemonDetailResponse.json();

    // Extract the Pokemon ID from the URL
    const urlParts = pokemon.url.split('/');
    const pokemonId = urlParts[urlParts.length - 2];

    // Fetch species information for origin stories
    const speciesResponse = await fetch(pokemonDetailData.species.url);
    const speciesData = await speciesResponse.json();

    // Get the flavor text (origin story) in English
    const flavorTextEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    );

    return {
      id: pokemonId, // Include the Pokemon ID
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
      sprites: pokemonDetailData.sprites, // Include all sprites
      types: pokemonDetailData.types, // Include types
      stats: pokemonDetailData.stats, // Include stats
      origin: flavorTextEntry ? flavorTextEntry.flavor_text : 'No origin available',
      speciesUrl: pokemonDetailData.species.url,
      url: pokemon.url // Keep the original URL
    };
  });

  const detailedPokemonList = await Promise.all(detailedPokemonPromises);
  return detailedPokemonList;
};

// Fetch Pokémon by name (used for search or detail views)
export const fetchPokemonByName = async (name) => {
  const response = await axios.get(`${API_BASE_URL}pokemon/${name}`);
  const pokemonDetailData = response.data;

  // Fetch species information for origin stories
  const speciesResponse = await axios.get(pokemonDetailData.species.url);
  const speciesData = speciesResponse.data;

  // Get the flavor text (origin story) in English
  const flavorTextEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );

  return {
    name: pokemonDetailData.name,
    image: pokemonDetailData.sprites.front_default, // Fetch the default front sprite
    origin: flavorTextEntry ? flavorTextEntry.flavor_text : 'No origin available', // Fetch the origin story
    types: pokemonDetailData.types, // Return types if needed
  };
};

// Fetch Pokémon by type with added origin and species data
export const fetchPokemonByType = async (type) => {
  const response = await axios.get(`${API_BASE_URL}type/${type}`);
  const pokemonData = await Promise.all(
    response.data.pokemon.map(async (pokemonData) => {
      const pokeResponse = await axios.get(pokemonData.pokemon.url);
      const pokemonDetailData = pokeResponse.data;

      // Fetch species information for origin stories
      const speciesResponse = await axios.get(pokemonDetailData.species.url);
      const speciesData = speciesResponse.data;

      // Get the flavor text (origin story) in English
      const flavorTextEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      );

      // Return an object with name, image, origin story, and other relevant data
      return {
        name: pokemonDetailData.name,
        id: pokemonDetailData.id,
        image: pokemonDetailData.sprites.front_default, // Get the image URL
        types: pokemonDetailData.types,
        base_stat: pokemonDetailData.base_stat || 0, // Base stat if needed
        origin: flavorTextEntry ? flavorTextEntry.flavor_text : 'No origin available', // Fetch the origin story
      };
    })
  );
  return pokemonData;
};
