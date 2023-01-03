import { Button, Form, Input, InputNumber, Table } from 'antd';
import axios from 'axios';
import numeral from 'numeral';
import React from 'react';

export default function DiscountPage() {
  const [products, setProducts] = React.useState([]);
  // Columns of Antd Table
  const columns = [
    {
      title: 'TT',
      key: 'no',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <span>{index + 1}</span>
          </div>
        );
      },
    },

    {
      title: () => {
        return <div style={{ whiteSpace: 'nowrap' }}>Danh mục</div>;
      },
      dataIndex: 'category',
      key: 'category',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <span>{record.category?.name}</span>
          </div>
        );
      },
    },

    {
      title: () => {
        return <div style={{ whiteSpace: 'nowrap' }}>Nhà cung cấp</div>;
      },
      dataIndex: 'supplier',
      key: 'supplier',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <span>{record.supplier?.name}</span>
          </div>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      render: (text, record, index) => {
        return (
          <div>
            <strong>{text}</strong>
          </div>
        );
      },
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <strong>{numeral(text).format('0,0$')}</strong>
          </div>
        );
      },
    },
    {
      title: 'Giảm',
      dataIndex: 'discount',
      key: 'discount',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <strong>{numeral(text).format('0,0')}%</strong>
          </div>
        );
      },
    },
    {
      title: 'Tồn',
      dataIndex: 'stock',
      key: 'stock',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <strong>{numeral(text).format('0,0')}</strong>
          </div>
        );
      },
    },
  ];

  const [searchForm] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
    let { discount } = values;

    // CALL API TO CREATE CUSTOMER
    axios.get('http://localhost:9000/products/questions/1?discount=' + discount, values).then((response) => {
      console.log(response.data);
      setProducts(response.data);
    });
  };

  return (
    <div>
      <Form
        form={searchForm}
        name='search'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
      >
        {/* FIRST NAME */}
        <Form.Item
          label='Nhập mức giảm giá'
          name='discount'
          rules={[
            {
              required: true,
              message: 'Please input discount!',
            },
          ]}
        >
          <InputNumber min={0} max={100} />
        </Form.Item>

        {/* SUBMIT */}
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>

      {/* TABLE */}
      <Table rowKey='_id' dataSource={products} columns={columns} pagination={false} />
    </div>
  );
}
