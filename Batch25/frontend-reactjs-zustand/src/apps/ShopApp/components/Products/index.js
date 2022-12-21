import React from 'react';
import { useCartStore } from '../../hooks/useCartStore';
import { products } from '../../data/products';

export default function Products() {
  const { add } = useCartStore((state) => state);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: 24 }}>
      {products.map((p) => {
        return (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={p.imageUrl} alt='' style={{ width: 240 }} />
            <strong>{p.name}</strong>
            <strong>{p.price}</strong>
            <button
              style={{
                marginTop: 12,
                height: 42,
                border: 0,
                width: 80,
              }}
              onClick={() => {
                add({ product: p, quantity: 1 });
              }}
            >
              Add
            </button>
          </div>
        );
      })}
    </div>
  );
}
