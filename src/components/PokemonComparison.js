import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

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
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon1, setSelectedPokemon1] = useState('');
  const [selectedPokemon2, setSelectedPokemon2] = useState('');
  const [pokemonData1, setPokemonData1] = useState(null);
  const [pokemonData2, setPokemonData2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchPokemonList();
      setPokemonList(list);
    };
    fetchData();
  }, []);

  const handleCompare = async () => {
    if (selectedPokemon1 && selectedPokemon2) {
      const data1 = await fetchPokemonByName(selectedPokemon1.toLowerCase());
      const data2 = await fetchPokemonByName(selectedPokemon2.toLowerCase());

      setPokemonData1(data1);
      setPokemonData2(data2);
    }
  };

  const renderStatsComparison = () => {
    if (!pokemonData1 || !pokemonData2) return null;

    return (
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>{pokemonData1.name}</th>
            <th>{pokemonData2.name}</th>
          </tr>
        </thead>
        <tbody>
          {pokemonData1.stats.map((stat1, index) => (
            <tr key={stat1.stat.name}>
              <td>{stat1.stat.name.toUpperCase()}</td>
              <td>{stat1.base_stat}</td>
              <td>{pokemonData2.stats[index]?.base_stat || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderRadarChart = () => {
    if (!pokemonData1 || !pokemonData2) return null;

    const labels = pokemonData1.stats.map(stat => stat.stat.name.toUpperCase());
    const data = {
      labels: labels,
      datasets: [
        {
          label: pokemonData1.name,
          data: pokemonData1.stats.map(stat => stat.base_stat),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: pokemonData2.name,
          data: pokemonData2.stats.map(stat => stat.base_stat),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    return (
      <Radar data={data} options={{ maintainAspectRatio: false }} />
    );
  };

  return (
    <div className="pokemon-comparison">
      <h2>Compare Pokémon</h2>

      <div className="select-comparison">
        <select
          value={selectedPokemon1}
          onChange={(e) => setSelectedPokemon1(e.target.value)}
        >
          <option value="">Select Pokémon 1</option>
          {pokemonList.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <select
          value={selectedPokemon2}
          onChange={(e) => setSelectedPokemon2(e.target.value)}
        >
          <option value="">Select Pokémon 2</option>
          {pokemonList.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <button onClick={handleCompare}>Compare</button>
      </div>

      {pokemonData1 && pokemonData2 && (
        <div className="comparison-result">
          <h3>{pokemonData1.name} vs {pokemonData2.name}</h3>
          <div className="comparison-tables">
            {renderStatsComparison()}
          </div>
          <div className="radar-chart">
            {renderRadarChart()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonComparison;
