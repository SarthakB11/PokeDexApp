// components/StatsRadarChart.js
import React from 'react';
import { Radar } from 'react-chartjs-2';

const StatsRadarChart = ({ pokemon1, pokemon2 }) => {
  const data = {
    labels: ['HP', 'Attack', 'Defense', 'Speed', 'Special Attack', 'Special Defense'],
    datasets: [
      {
        label: pokemon1.name,
        data: pokemon1.stats.map(stat => stat.base_stat),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: pokemon2.name,
        data: pokemon2.stats.map(stat => stat.base_stat),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="radar-chart">
      <Radar data={data} />
    </div>
  );
};

export default StatsRadarChart;
