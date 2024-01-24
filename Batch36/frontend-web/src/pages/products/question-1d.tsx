import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Form, InputNumber, Table } from 'antd';
import React from 'react';
import { axiosClient } from '../../libraries/axiosClient';
import numeral from 'numeral';
type Props = {};

type FieldType = {
  discountMin: number;
  discountMax: number;
};

export default function Question_1d({}: Props) {
  const [loading, setLoading] = React.useState(false); // for button
  const [products, setProducts] = React.useState([]);
  const [createForm] = Form.useForm<FieldType>();

  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/products/questions/1d?discountMin=${values.discountMin}&discountMax=${values.discountMax}`);
      console.log(response.data);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{index + 1}</div>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '20%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.category.name}</span>;
      },
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '20%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.supplier.name}</span>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{numeral(text).format('$0,0')}</div>;
      },
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        let color = '#4096ff';

        if (record.discount >= 50) {
          color = '#ff4d4f';
        }

        return <div style={{ textAlign: 'right', color: color }}>{numeral(text).format('0,0.0')}%</div>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{numeral(text).format('$0,0')}</div>;
      },
    },

    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{numeral(text).format('0,0.0')}</div>;
      },
    },
  ];

  return (
    <div style={{ padding: 36 }}>
      {/* FORM */}
      {/* 2 fields: discountMin, discountMax */}
      <Card title='Tìm kiếm sản phẩm theo mức giảm giá'>
        <Form
          form={createForm}
          name='create-category'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            discountMin: 0,
            discountMax: 50,
          }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType> label='Mininum' name='discountMin' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item<FieldType> label='Maximum' name='discountMax' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit' icon={<SearchOutlined />} loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div style={{ height: 24 }} />
      <Card title='Kết quả tìm kiếm'>
        <Table columns={columns} dataSource={products} rowKey='_id' />
      </Card>
    </div>
  );
}
