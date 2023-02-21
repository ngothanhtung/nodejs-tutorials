import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

type Props = {
  product: any;
};

export default function ProductDetails({ product }: Props) {
  const router = useRouter();
  const { id } = router.query;

  // fallback = true
  if (router.isFallback) {
    return (
      <div style={{ display: 'flex', flex: 1, height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <h1>Loading ...</h1>
      </div>
    );
  }

  return (
    <div>
      <ul>
        <li>Product ID: {product._id}</li>
        <li>Name: {product.name}</li>
        <li>Price: {product.price}</li>
      </ul>
    </div>
  );
}

export async function getStaticPaths() {
  const products = (await axios.get('http://localhost:9000/products')).data as any[];

  const paths = products.map((product: any) => ({
    params: { id: product._id },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }: any) {
  const product = (await axios.get(`http://localhost:9000/products/${params.id}`)).data;

  if (!product._id) {
    return { notFound: true };
  }

  return { props: { product } };
}
