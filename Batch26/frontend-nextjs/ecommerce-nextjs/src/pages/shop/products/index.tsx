import React from 'react';
import Link from 'next/link';

import axios from 'axios';

type Props = {
  products: [];
};

export default function Products({ products }: Props) {
  return (
    <div>
      <h1>Products</h1>
      {products &&
        products.map((p: any) => {
          return <div key={p._id}>{p.name}</div>;
        })}
      <Link href='/shop/products/19'>Go to product details</Link>
      {/* <hr />
      <a href='/shop/products/19'>Go to product details</a> */}
    </div>
  );
}

export async function getStaticProps(context: any) {
  const response = await axios.get('http://localhost:9000/products');
  const products = response.data;

  return {
    props: {
      products,
    }, // will be passed to the page component as props,
    revalidate: 30, // In seconds
  };
}
