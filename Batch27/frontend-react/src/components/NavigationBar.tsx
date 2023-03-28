import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import React from 'react';

import { useNavigate } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'home',
    icon: <HomeOutlined />,
  },

  {
    label: 'Management',
    key: 'management',
    icon: <SettingOutlined />,
    children: [
      {
        label: 'Categories',
        key: 'categories',
      },
      {
        label: 'Suppliers',
        key: 'suppliers',
      },
      {
        label: 'Products',
        key: 'products',
      },
      {
        label: 'Customers',
        key: 'customers',
      },
      {
        label: 'Employees',
        key: 'employees',
      },
    ],
  },
  {
    label: 'Orders',
    key: 'orders',
  },
];

export default function NavigationBar() {
  const navigate = useNavigate();

  const [current, setCurrent] = React.useState('home');

  return (
    <Menu
      theme='dark'
      onClick={(e) => {
        console.log(e);
        setCurrent(e.key);
        navigate(e.key);
      }}
      selectedKeys={[current]}
      mode='horizontal'
      items={items}
    />
  );
}
