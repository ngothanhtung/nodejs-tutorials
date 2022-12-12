import React from 'react';
import { axiosClient } from '../../libraries/axiosClient';

type Props = {
  product: any;
};

export default function ProductDetails({ product }: Props) {
  return <div>{<h1>{product.name}</h1>}</div>;
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const products = (await axiosClient.get('/products')) as any[];

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  const paths = products.map((product: any) => ({
    params: { id: product._id },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }: any) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const product = await axiosClient(`/products/${params.id}`);

  // Pass post data to the page via props
  return { props: { product } };
}
