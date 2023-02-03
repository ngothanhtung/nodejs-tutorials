import React from 'react';
import Carts from './components/Carts';
import Login from './components/Login';
import CreateOrder from './components/Order/CreateOrder';
import Products from './components/Products';

export default function ShopApp() {
  return (
    <div>
      <Login />
      <Products />
      <Carts />
      <hr />
      <CreateOrder />
    </div>
  );
}
