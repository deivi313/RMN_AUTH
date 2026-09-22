import axios from 'axios';

// One configured client for the whole app
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend address
});

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns an axios error into a message we can show the user
export const getError = (err) => err.response?.data?.message || 'Something went wrong. Try again.';

export default api;
