'use client';
import { useCartStore } from '@/providers/cart-store-provider';
import React from 'react';

type Props = {};

export default function ClearCart({}: Props) {
  const { clearCart } = useCartStore((state) => state);
  return <button onClick={clearCart}>Clear Cart</button>;
}
