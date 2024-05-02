import Product from '@/components/product';
import axios from 'axios';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = false; // false | 0 | number (seconds)

async function getProducts() {
  const response = await axios.get('https://server.aptech.io/online-shop/products');
  const data = response.data;
  return data;
}

// Metadata
export const metadata: Metadata = {
  title: 'Products',
  description: 'Products page',
};

type Props = {};

export default async function Products({}: Props) {
  const products = await getProducts();
  return (
    <div>
      <div className='flex flex-wrap -mx-4'>
        {products.map((product: any) => (
          <Product key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
}
