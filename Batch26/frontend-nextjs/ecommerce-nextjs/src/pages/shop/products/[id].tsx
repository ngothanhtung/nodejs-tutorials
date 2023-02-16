import React from 'react';
import { useRouter } from 'next/router';

type Props = {};

export default function ProductDetails({}: Props) {
  const router = useRouter();
  const { id } = router.query;
  return <div>Product Details: {id}</div>;
}
