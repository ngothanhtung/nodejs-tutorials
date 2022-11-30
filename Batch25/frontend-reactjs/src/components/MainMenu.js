import { DatabaseOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const items = [
  { label: 'Trang chủ', key: 'home', icon: <HomeOutlined /> }, // remember to pass the key prop
  { label: 'Cấu hình', key: 'settings', icon: <SettingOutlined /> }, // which is required
  {
    label: 'Quản trị dữ liệu',
    key: 'management',
    icon: <DatabaseOutlined />,
    children: [
      { label: 'Nhân viên', key: 'management-employees', icon: <img src='/images/employee.png' style={{ width: 16 }} /> },
      { label: 'Sản phẩm', key: 'management-products' },
    ],
  },
  {
    label: 'Quản lý bán hàng',
    key: 'sales',
    children: [
      {
        label: 'Đơn hàng',
        key: 'sales-orders-menu',
        children: [
          {
            label: 'Đơn hàng',
            key: 'sales-orders',
          },
          {
            label: 'Thông kê theo trạng thái',
            key: 'sales-orders-status',
          },
          {
            label: 'Thông kê theo thanh toán',
            key: 'sales-orders-payment-status ',
          },
        ],
      },
    ],
  },
];

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div>
      <Menu
        theme='dark'
        items={items}
        onClick={({ key }) => {
          navigate('/' + key.split('-').join('/'));
          console.log(key);
        }}
      />
    </div>
  );
}
