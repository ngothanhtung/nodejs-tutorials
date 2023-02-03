import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  devtools(
    persist((set, get) => ({
      loggedInUser: null,
      login: ({ email, password }) => {
        // AXIOS: Call 1 api login => user
        axios
          .post('http://localhost:9000/auth/login', {
            email,
            password,
          })
          .then((response) => {
            return set({ loggedInUser: response.data }, false, { type: 'auth/login-success' });
          })
          .catch((err) => {
            return set({ loggedInUser: null }, false, { type: 'auth/login-error' });
          });

        return set({ loggedInUser: null }, false, { type: 'auth/login-error' });
      },
      logout: () => {
        // AXIOS: Call 1 api login => user
        return set({ loggedInUser: null }, false, { type: 'auth/logout-success' });
      },
    })),
  ),
);
