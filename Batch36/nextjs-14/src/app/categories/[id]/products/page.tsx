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
          <div key={product.id} className='w-full sm:w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 px-4 mb-8'>
            <div className='col-span-4 bg-white shadow-md rounded-lg overflow-hidden'>
              <div className='relative'>
                <img className='w-full  object-cover' src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Product Image' />
                <span className='absolute top-0 right-0 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-bl'>{product?.discount}% OFF</span>
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{product?.name}</h3>
                <div className='flex items-center'>
                  <span className='text-gray-600 text-xl font-semibold'>${product?.price}</span>
                </div>
                <div className='mt-2'>
                  <span className='text-gray-500 text-sm'>{product?.description}</span>
                </div>
                <div className='mt-4'>
                  <button className='text-white bg-red-500 px-4 py-2 rounded-md'>Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
