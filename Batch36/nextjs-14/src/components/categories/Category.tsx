import Link from 'next/link';
import React from 'react';

type Props = {
  category: any;
};

export default function Category({ category }: Props) {
  return (
    <div className='mb-4 p-1'>
      <Link key={category.id} href={`/categories/${category.id}/products`} className='hover:text-blue-500'>
        {category.name}
      </Link>
    </div>
  );
}
