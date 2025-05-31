import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ margin: '20px 0' }}>
      <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
      <Link to="/favorites" style={{ marginRight: '20px' }}>Favorites</Link>
      <Link to="/compare">Compare</Link>
    </nav>
  );
};

export default Navigation;
