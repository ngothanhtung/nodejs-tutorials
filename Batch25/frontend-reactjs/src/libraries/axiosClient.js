import axios from 'axios';
import { API_URL } from '../constants/URLS';

export const axiosClient = axios.create({
  baseURL: API_URL,
  // timeout: 1000,
});
