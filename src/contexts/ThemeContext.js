import React, { createContext, useState, useEffect } from 'react';

// Create the Theme Context
export const ThemeContext = createContext();

// Create the Theme Provider component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode is stored in localStorage or use system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    // Check if user prefers dark mode
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // State to track dark mode
  const [isDarkMode, setIsDarkMode] = useState(getInitialMode);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Provide the context value to children
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
