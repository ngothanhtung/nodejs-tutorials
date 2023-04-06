import React from 'react';
import { useCartStore } from '../../hooks/useCartStore';

export default function CreateOrder() {
  const { items } = useCartStore((state) => state);
  return (
    <div>
      <button
        style={{ border: 0, height: 42, width: 120 }}
        onClick={() => {
          console.log('items', items);
        }}
      >
        Create Order
      </button>
    </div>
  );
}
