import axios from 'axios';

// Define the base URL with a fallback
const baseURL = process.env.NEXT_PUBLIC_URL || 'https://api.lispendens.com';

// Create a custom axios instance with default config
const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/vnd.connect.v1+json',
    'Content-Type': 'application/json',
  },
  // Add additional config for CORS if needed
  withCredentials: false,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request to: ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('API Error Response:', error.response || error);
    
    // Network errors won't have a response property
    if (!error.response) {
      console.error('Network Error - Check CORS and API availability');
    }
    
    return Promise.reject(error);
  }
);

export default api;
