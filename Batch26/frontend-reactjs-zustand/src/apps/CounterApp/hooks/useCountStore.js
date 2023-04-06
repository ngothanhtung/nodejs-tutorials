import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';

export const useCountStore = create(
  devtools(
    persist((set) => ({
      count: 0,
      increase: (number) => set((state) => ({ count: state.count + number }), false, { type: 'increase', number }),
      decrease: (number) => set((state) => ({ count: state.count - number })),
    })),
  ),
);
