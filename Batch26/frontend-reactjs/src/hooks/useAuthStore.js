import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        auth: null,
        login: ({ username, password }) => {
          // AXIOS: Call 1 api login => user
          axios
            .post('http://localhost:9000/auth/login-jwt', {
              username,
              password,
            })
            .then((response) => {
              return set({ auth: response.data }, false, { type: 'auth/login-success' });
            })
            .catch((err) => {
              return set({ auth: null }, false, { type: 'auth/login-error' });
            });
        },
        logout: () => {
          // AXIOS: Call 1 api login => user
          return set({ auth: null }, false, { type: 'auth/logout-success' });
        },
      }),
      {
        name: 'onlineshop-storage', // unique name
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  ),
);
