import axios, { AxiosError, AxiosResponse } from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // Backend base URL
  withCredentials: true, // Include cookies in requests/responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling successful responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      const status = error.response.status;
      const message = (error.response.data as any)?.error || 'An error occurred';

      switch (status) {
        case 400:
          console.error('Bad Request:', message);
          break;
        case 401:
          console.error('Unauthorized:', message);
          // Optionally trigger a token refresh or redirect to login
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error(`Error ${status}:`, message);
      }

      // Return a rejected promise with the error message
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // No response received from the server
      console.error('No response from server:', error.request);
      return Promise.reject(new Error('No response from server'));
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;