// API configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : 'https://quirkyroomie-d9dl.onrender.com/api'
  );

export { API_BASE_URL };