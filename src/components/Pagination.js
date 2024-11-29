import React from 'react';

const Pagination = ({ pokemonPerPage, totalPokemon, paginate, currentPage }) => {
  const pageNumbers = [];

  // Calculate total number of pages
  for (let i = 1; i <= Math.ceil(totalPokemon / pokemonPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
