'use client';
import React from 'react';

import { useCartStore } from '@/providers/cart-store-provider';

type Props = {
  product: any;
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCartStore((state) => state);
  return (
    <button
      className='text-white bg-red-500 px-4 py-2 rounded-md'
      onClick={() => {
        addToCart({
          product: product,
          quantity: 1,
        });
      }}
    >
      Add to cart
    </button>
  );
}
