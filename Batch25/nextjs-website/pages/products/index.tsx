import React from 'react';
import Head from 'next/head';
import Button from '../../components/Button';
import { axiosClient } from '../../libraries/axiosClient';

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
      <div className='container'>
        <h2>
          <Button title='Search' />
        </h2>
        <strong>Jean</strong>
        <hr />
        {products &&
          products.map((product: any) => {
            return (
              <div key={product._id}>
                <h4>{product.name}</h4>
              </div>
            );
          })}
      </div>
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
