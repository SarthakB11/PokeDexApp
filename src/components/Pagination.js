import React, { useCallback } from 'react';
import { motion } from 'framer-motion';

const Pagination = ({ pokemonPerPage, totalPokemon, currentPage, setCurrentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPokemon / pokemonPerPage); i++) {
    pageNumbers.push(i);
  }

  // Calculate which page numbers to show (current page, 2 before, 2 after)
  const getVisiblePageNumbers = useCallback(() => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pageNumbers.length, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return pageNumbers.slice(startPage - 1, endPage);
  }, [currentPage, pageNumbers]);

  const visiblePages = getVisiblePageNumbers();
  
  // Handle page change with debounce to prevent multiple clicks
  const handlePageChange = useCallback((pageNumber) => {
    if (pageNumber < 1 || pageNumber > pageNumbers.length || pageNumber === currentPage) {
      return; // Don't change if invalid page or same page
    }
    setCurrentPage(pageNumber);
  }, [currentPage, pageNumbers.length, setCurrentPage]);
  
  return (
    <motion.div 
      className="pagination-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.ul className="pagination">
        {/* First page button */}
        {currentPage > 3 && (
          <motion.li 
            className="page-item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.button 
              onClick={() => handlePageChange(1)} 
              className="page-link first-page"
              whileHover={{ backgroundColor: '#ffcb05' }}
            >
              <span>«</span>
            </motion.button>
          </motion.li>
        )}
        
        {/* Previous page button */}
        {currentPage > 1 && (
          <motion.li 
            className="page-item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.button 
              onClick={() => handlePageChange(currentPage - 1)} 
              className="page-link prev-page"
              whileHover={{ backgroundColor: '#ffcb05' }}
            >
              <span>‹</span>
            </motion.button>
          </motion.li>
        )}
        
        {/* Page numbers */}
        {visiblePages.map(number => (
          <motion.li 
            key={number} 
            className={`page-item ${currentPage === number ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.button
              onClick={() => handlePageChange(number)}
              className={`page-link ${currentPage === number ? 'current-page' : ''}`}
              initial={currentPage === number ? { backgroundColor: '#3c5aa6', color: '#ffffff' } : {}}
              whileHover={{ 
                backgroundColor: currentPage === number ? '#2a75bb' : '#ffcb05',
                color: '#000000'
              }}
            >
              {number}
            </motion.button>
          </motion.li>
        ))}
        
        {/* Next page button */}
        {currentPage < pageNumbers.length && (
          <motion.li 
            className="page-item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.button 
              onClick={() => handlePageChange(currentPage + 1)} 
              className="page-link next-page"
              whileHover={{ backgroundColor: '#ffcb05' }}
            >
              <span>›</span>
            </motion.button>
          </motion.li>
        )}
        
        {/* Last page button */}
        {currentPage < pageNumbers.length - 2 && (
          <motion.li 
            className="page-item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.button 
              onClick={() => handlePageChange(pageNumbers.length)} 
              className="page-link last-page"
              whileHover={{ backgroundColor: '#ffcb05' }}
            >
              <span>»</span>
            </motion.button>
          </motion.li>
        )}
      </motion.ul>
      
      <motion.div 
        className="pagination-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Page {currentPage} of {pageNumbers.length} • 
        Showing {Math.min(currentPage * pokemonPerPage, totalPokemon)} of {totalPokemon} Pokémon
      </motion.div>
    </motion.div>
  );
};

export default Pagination;
