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
import { FileOutlined, HomeOutlined, MessageOutlined, UploadOutlined } from '@ant-design/icons';
import Products from './pages/products';
import Orders from './pages/orders';
import FormUpload from './pages/upload/FormUpload';
import AntUpload from './pages/upload/AntUpload';
import ManualAntUpload from './pages/upload/ManualAntUpload';
import Chat from './pages/chat';
import StudentQuizPage from './pages/quiz/StudentQuizPage';
import TeacherQuizPage from './pages/quiz/TeacherQuizPage';

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
        path: '/management/products',
        element: <Products />,
      },
      {
        path: '/management/orders',
        element: <Orders />,
      },
      {
        path: '/upload',
        element: <FormUpload />,
      },
      {
        path: '/upload/antd',
        element: <AntUpload />,
      },
      {
        path: '/upload/antd-form',
        element: <ManualAntUpload />,
      },

      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/quiz/student',
        element: <StudentQuizPage />,
      },
      {
        path: '/quiz/teacher',
        element: <TeacherQuizPage />,
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
    key: '/upload',
    label: 'Upload',
    icon: <UploadOutlined />,
  },
  {
    key: '/upload/antd',
    label: 'Upload with Antd',
    icon: <UploadOutlined />,
  },
  {
    key: '/upload/antd-form',
    label: 'Upload with Antd Form',
    icon: <UploadOutlined />,
  },

  {
    key: '/chat',
    label: 'Chat',
    icon: <MessageOutlined />,
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
      {
        key: '/management/orders',
        label: 'Orders',
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
