import axios from 'axios';
import { API_URL } from '../constants/URLS';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RESPONSE
axiosClient.interceptors.response.use(async (response) => {
  return response.data;
});

export { axiosClient };
