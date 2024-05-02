'use client';
import { useCartStore } from '@/providers/cart-store-provider';
import React from 'react';
import numeral from 'numeral';

type Props = {};

export default function TotalLabel({}: Props) {
  const { items } = useCartStore((state) => state);

  // Sum of all items in the cart
  const total = items.reduce((accumulator, item) => {
    return accumulator + ((item.product.price * (100 - item.product.discount)) / 100) * item.quantity;
  }, 0);
  return <div>Total: {numeral(total).format('$0,0')}</div>;
}
