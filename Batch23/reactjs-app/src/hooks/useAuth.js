import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuth = create(
  devtools((set) => ({
    auth: null,
    signIn: (payload) => set(() => ({ auth: payload }), false, '@auth/signIn'),
    signOut: () => set({ auth: null }, false, '@auth/signOut'),
  })),
);

export default useAuth;
