import { useRouter } from 'next/router';
import React from 'react';

type Props = {};

export default function Products({}: Props) {
  const router = useRouter();

  console.log(router.query);

  return <div>Products</div>;
}
