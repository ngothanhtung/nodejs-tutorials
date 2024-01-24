import React from 'react';
import { Button, Layout, Menu, MenuItemProps } from 'antd';
import './App.css';
import Categories from './pages/categories';
import Question_1d from './pages/products/question-1d';
import numeral from 'numeral';
import 'numeral/locales/vi';

import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigate, useRoutes } from 'react-router-dom';
import Home from './pages/home';
import { MenuItemType } from 'antd/es/menu/hooks/useItems';
import { FileOutlined, HomeOutlined } from '@ant-design/icons';

// numeral.locale('vi');

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/management/categories',
        element: <Categories />,
      },
      {
        path: '/reports/products/discount',
        element: <Question_1d />,
      },
    ],
  },
]);

const items = [
  {
    key: '/',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    key: '/management',
    label: 'Management',
    icon: <FileOutlined />,
    children: [
      {
        key: '/management/categories',
        label: 'Categories',
      },
      {
        key: '/management/products',
        label: 'Products',
      },
    ],
  },
  {
    key: '/reports',
    label: 'Reports',
    icon: <FileOutlined />,
    children: [
      {
        key: '/reports/products',
        label: 'Products',
        children: [
          {
            key: '/reports/products/discount',
            label: 'Discount',
          },
          {
            key: '/reports/products/stock',
            label: 'Stock',
          },
        ],
      },
    ],
  },
];

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

function Root() {
  const navigate = useNavigate();
  let location = useLocation();
  console.log(location.pathname);

  return (
    <React.Fragment>
      <Layout>
        <Layout.Header>
          <Menu
            theme='dark'
            mode='horizontal'
            defaultSelectedKeys={[location.pathname]}
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            onClick={(item) => {
              console.log(item);
              navigate(item.key);
            }}
          />
        </Layout.Header>
        <Layout.Content>
          <Outlet />
        </Layout.Content>
        <Layout.Footer>Footer</Layout.Footer>
      </Layout>
    </React.Fragment>
  );
}

export default App;
