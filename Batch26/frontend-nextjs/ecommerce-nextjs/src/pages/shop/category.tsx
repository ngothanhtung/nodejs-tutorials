import React from 'react';
import axios from 'axios';

type Props = {
  categories: [];
};

export default function Category({ categories }: Props) {
  // const [categories, setCategories] = React.useState([]);

  // React.useEffect(() => {
  //   axios.get('http://localhost:9000/categories').then((response) => {
  //     setCategories(response.data);
  //     console.log(response.data);
  //   });
  // }, []);
  console.log(categories);

  return <div>Category Page</div>;
}

export async function getServerSideProps(context: any) {
  const response = await axios.get('http://localhost:9000/categories');
  const categories = response.data;

  return {
    props: {
      categories,
    }, // will be passed to the page component as props
  };
}
