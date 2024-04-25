import React from 'react';
import axios from 'axios';
import Link from 'next/link';

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = false; // false | 0 | number (seconds)

async function getCategories() {
  const response = await axios.get('https://server.aptech.io/online-shop/categories');
  const data = response.data;
  return data;
}

type Props = {};

export default async function Categories({}: Props) {
  const data = await getCategories();
  return (
    <div className='flex flex-col'>
      {data?.map((category: any) => {
        return (
          <Link key={category.id} href={`/categories/${category.id}/products`}>
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
