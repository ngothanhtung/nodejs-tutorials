import Product from '@/components/product';
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

async function getProducts(categoryId: string) {
  const response = await axios.get(`https://server.aptech.io/online-shop/categories/${categoryId}/products`);
  return response.data;
}

async function getCategory(id: string) {
  const response = await axios.get(`https://server.aptech.io/online-shop/categories/${id}`);
  return response.data;
}

export async function generateMetadata({ params }: Props) {
  const { id } = params;
  const category = await getCategory(id);

  return {
    title: `Products of Category ${category.name}`,
    description: `View all products of category ${category.name}`,
  };
}

export default async function Products({ params }: Props) {
  const { id } = params;
  const products = await getProducts(id);

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
