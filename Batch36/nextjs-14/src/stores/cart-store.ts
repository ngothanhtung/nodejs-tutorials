// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla';

export type CartItemType = {
  product: any;
  quantity: number;
};

export type CartState = {
  items: CartItemType[];
};

export type CartActions = {
  addToCart: ({ product, quantity }: any) => void;
  decreaseQuantity: ({ productId }: any) => void;
  removeFromCart: ({ productId }: any) => void;
  clearCart: () => void;
};

export type CartStore = CartState & CartActions;

export const initCartStore = (): CartState => {
  return { items: [] };
};

export const defaultInitState: CartState = {
  items: [],
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()((set, get) => ({
    ...initState,
    addToCart: ({ product, quantity }) => {
      const items = get().items;
      const found = items.find((x) => x.product.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        items.push({ product, quantity });
      }

      return set({ items: items }, false);
    },
    decreaseQuantity: ({ productId }) => {
      const items = get().items;
      const found = items.find((x) => x.product.id === productId);
      if (found) {
        if (found.quantity > 1) {
          found.quantity--;
          return set({ items: items }, false);
        } else {
          const newItems = items.filter((x) => x.product.id !== productId);
          return set({ items: newItems }, false);
        }
      }
    },
    removeFromCart: ({ productId }) => {
      const items = get().items;
      const newItems = items.filter((x) => x.product.id !== productId);
      return set({ items: newItems }, false);
    },
    clearCart: () => {
      return set({ items: [] }, false);
    },
  }));
};
