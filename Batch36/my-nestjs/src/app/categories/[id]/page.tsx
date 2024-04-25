import axios from 'axios';
import React from 'react';

export async function generateStaticParams() {
  const response = await axios.get('https://server.aptech.io/online-shop/categories');

  return response.data.map((category: any) => ({
    id: category.id?.toString(),
  }));
}

type Props = {
  params: {
    id: string;
  };
};

export default function CategoryDetails({ params }: Props) {
  return (
    <div>
      <h1>Category Details</h1>
      <strong>{params.id}</strong>
    </div>
  );
}
