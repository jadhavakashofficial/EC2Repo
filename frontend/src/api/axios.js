// frontend/src/api/axios.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend URL local url='http://localhost:5001/api'
  //'https://school-crm-8uq8.onrender.com/api'
  withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
