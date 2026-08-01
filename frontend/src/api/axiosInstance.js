import axios from 'axios';

// Create a pre-configured Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for centralized error extraction
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Extract a readable error message from backend structure
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
        // If there are detailed validation errors, attach them
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          error.validationErrors = error.response.data.errors;
        }
      } else {
        errorMessage = `Server Error: ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'No response received from server. Please check your network connection.';
    }
    
    error.extractedMessage = errorMessage;
    return Promise.reject(error);
  }
);

export default axiosInstance;
