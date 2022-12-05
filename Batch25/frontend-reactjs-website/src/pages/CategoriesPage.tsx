import Categories from 'components/Categories';
import React from 'react';

type Props = {};

export default function CategoriesPage({}: Props) {
  return (
    <div className='bg-blue-600'>
      <Categories />
    </div>
  );
}
