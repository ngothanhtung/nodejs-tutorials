import React from 'react';
import axios from 'axios';
import Link from 'next/link';

async function getCategories() {
  const response = await axios.get('https://server.aptech.io/online-shop/categories');
  return response.data;
}

type Props = {};

export default async function Categories({}: Props) {
  const categories = await getCategories();
  return (
    <div className='flex flex-col'>
      {categories.map((category: any) => {
        return (
          <Link key={category.id} href={`/categories/${category.id}`}>
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
