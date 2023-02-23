import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

export default function ProductDetails({}: Props) {
  const router = useRouter();

  console.log(router.query);

  return <div>Product Details of Category</div>;
}
