import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { axiosClient } from '../libraries/axiosClient';

export default function Categories() {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    axiosClient.get('/categories').then((response) => {
      setCategories(response.data);
    });
  }, []);
  return (
    <div>
      {categories &&
        categories.map((c) => {
          return (
            <div key={c._id}>
              <strong>{c._id}</strong>
              <Link to={'/categories/' + c._id + '/products'}>{c.name}</Link>
            </div>
          );
        })}
    </div>
  );
}
