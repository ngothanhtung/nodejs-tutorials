'use client';
import { useCartStore } from '@/providers/cart-store-provider';
import Link from 'next/link';
import React from 'react';

type Props = {};

export default function CartLink({}: Props) {
  const { items } = useCartStore((state) => state);
  return <Link href='/cart'>Cart ({items.length})</Link>;
}
