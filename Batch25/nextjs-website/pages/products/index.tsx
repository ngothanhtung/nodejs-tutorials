/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Head from 'next/head';
import { Grid, Card, Text } from '@nextui-org/react';
import { axiosClient } from '../../libraries/axiosClient';
import { API_URL } from '../../constants/URLS';

type Props = {
  products: any[];
};

export default function Products({ products }: Props) {
  // const [products, setProducts] = React.useState([]);
  // React.useEffect(() => {
  //   axiosClient.get('/products').then((results: any) => {
  //     console.log(results);
  //     setProducts(results);
  //   });
  // }, []);

  return (
    <div>
      <Head>
        <title>Products</title>
        <meta name='description' content='Sản phẩm thương mại điện tử' />
        <meta name='keywords' content='san pham, thuong mai dien tu' />
      </Head>
      <Grid.Container gap={2} justify='center'>
        {products &&
          products.map((product: any) => {
            return (
              <Grid xs={3} key={product._id}>
                <Card css={{}}>
                  <h4 style={{ padding: 12 }}>{product.name}</h4>
                  <img src={`${API_URL}${product.imageUrl}`} style={{ width: '100%', height: 200, objectFit: 'cover' }} alt='' />
                </Card>
              </Grid>
            );
          })}
      </Grid.Container>
    </div>
  );
}

export async function getStaticProps(context: any) {
  const products = await axiosClient.get('/products');
  return {
    props: {
      products,
    }, // will be passed to the page component as props
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 3600, // In seconds
  };
}
