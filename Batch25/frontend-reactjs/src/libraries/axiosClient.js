import axios from 'axios';
import { API_URL } from '../constants/URLS';

const axiosClient = axios.create({
  baseURL: API_URL,
  // timeout: 1000,
});

// REQUEST
axiosClient.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('token');
  }

  return config;
});

// RESPONSE
axiosClient.interceptors.response.use(
  async (response) => {
    const { token } = response.data;
    // LOGIN
    console.log('token:', token);
    if (token) {
      window.localStorage.setItem('token', token);
    }

    const { refreshToken } = response.data;
    // LOGIN
    console.log('refreshToken:', refreshToken);
    if (refreshToken) {
      window.localStorage.setItem('refreshToken', refreshToken);
    }
    return response;
  },
  async (error) => {
    console.log(error);
    if (error.response.status === 401) {
      const refreshToken = window.localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios
          .post('http://localhost:9000/auth/refresh-token', {
            refreshToken: window.localStorage.getItem('refreshToken'),
          })
          .then((response) => {
            window.localStorage.setItem('token', response.data.token);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
        return axios(error.config);
      }
      return Promise.reject(error);
    }
    console.warn('Error status', error.response.status);
    return Promise.reject(error);
  },
);

export { axiosClient };
