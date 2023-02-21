import React from 'react';
import Link from 'next/link';
import { Grid, Card, Text, Row, Button } from '@nextui-org/react';

import axios from 'axios';
import { useRouter } from 'next/router';

type Props = {
  products: [];
};

export default function Products({ products }: Props) {
  const router = useRouter();

  return (
    <div>
      <h1>Products</h1>
      <Grid.Container gap={2}>
        {products &&
          products.map((p: any) => {
            return (
              <Grid sm={12} md={3} key={p._id}>
                <Card
                  isPressable
                  isHoverable
                  variant='bordered'
                  css={{ mw: '400px' }}
                  onPress={() => {
                    router.push(`/shop/products/${p._id}`);
                  }}
                >
                  {/* HEADER */}
                  <Card.Header>
                    <Text b>{p.name}</Text>
                  </Card.Header>
                  <Card.Divider />

                  {/* BODY */}
                  <Card.Body>
                    <Text>Price: {p.price}</Text>
                  </Card.Body>

                  <Card.Divider />
                  {/* FOOTER */}
                  <Card.Footer>
                    <Row justify='flex-end'>
                      <Link href={`/shop/products/${p._id}`}>
                        <Button size='sm'>Buy</Button>
                      </Link>
                    </Row>
                  </Card.Footer>
                </Card>
              </Grid>
            );
          })}
        {/* <Link href='/shop/products/19'>Go to product details</Link> */}
        {/* <hr />
      <a href='/shop/products/19'>Go to product details</a> */}
      </Grid.Container>
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
    revalidate: 1 * 60 * 60, // In seconds
  };
}
