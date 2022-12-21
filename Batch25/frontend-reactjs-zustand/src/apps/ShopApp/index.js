import React from 'react';
import Carts from './components/Carts';
import CreateOrder from './components/Order/CreateOrder';
import Products from './components/Products';

export default function ShopApp() {
  return (
    <div>
      <Products />
      <Carts />
      <hr />
      <CreateOrder />
    </div>
  );
}
