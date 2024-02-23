import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload } from 'antd';
import React from 'react';
import { axiosClient } from '../../libraries/axiosClient';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import axios from 'axios';

type Props = {};

type FieldType = {
  categoryId: string;
  supplierId: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  description?: string;
};

export default function Products({}: Props) {
  const [products, setProducts] = React.useState([]);

  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);

  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const [file, setFile] = React.useState(null);

  const getProducts = async () => {
    try {
      const response = await axiosClient.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axiosClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getSuppliers = async () => {
    try {
      const response = await axiosClient.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getProducts();
    getCategories();
    getSuppliers();
  }, []);

  const onFinish = async (values: any) => {
    try {
      console.log('Success:', values);
      const response = await axiosClient.post('/products', values);
      console.log(response.data);

      const _id = response.data._id;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', 'Category 1234');
        formData.append('description', 'Mo ta 1234');

        await axios.post('http://127.0.0.1:9000/upload/products/' + _id, formData);
      }

      getProducts();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/products/${id}`);
      getProducts();
      message.success('Product deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/products/${selectedProduct._id}`, values);
      getProducts();
      setSelectedProduct(null);
      message.success('Product updated successfully!');
    } catch (error) {
      console.log('Error:', error);
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
      title: 'Picture',
      key: 'imageUrl',
      dataIndex: 'imageUrl',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <img src={'http://localhost:9000' + text} style={{ height: 60 }} alt='' />;
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
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '1%',
      render: (text: any, record: any) => {
        return (
          <Space size='small'>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedProduct(record);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm
              title='Delete the product'
              description='Are you sure to delete this product?'
              onConfirm={() => {
                onDelete(record._id);
              }}
            >
              <Button type='primary' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 36 }}>
      <Card title='Create new product' style={{ width: '100%' }}>
        <Form form={createForm} name='create-product' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', discount: 0, stock: 0, description: '' }} onFinish={onFinish}>
          <Form.Item label='Image'>
            <Upload
              listType='text'
              showUploadList={true}
              beforeUpload={(f: any) => {
                setFile(f);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item<FieldType> name='categoryId' label='Category' rules={[{ required: true }]} hasFeedback>
            <Select
              options={categories.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> name='supplierId' label='Supplier' rules={[{ required: true }]} hasFeedback>
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> label='Name' name='name' rules={[{ required: true }]} hasFeedback>
            <Input />
          </Form.Item>
          {/* PRICE */}
          <Form.Item<FieldType> label='Price' name='price' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} />
          </Form.Item>

          {/* DISCOUNT */}
          <Form.Item<FieldType> label='Discount' name='discount' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} max={90} />
          </Form.Item>
          {/* STOCK */}
          <Form.Item<FieldType> label='Stock' name='stock' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item<FieldType> label='Description' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title='List of products' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={products} columns={columns} />
      </Card>

      <Modal
        centered
        title='Edit product'
        open={selectedProduct}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedProduct(null);
        }}
      >
        <Form form={updateForm} name='update-product' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onUpdate}>
          <Form.Item<FieldType> name='categoryId' label='Category' rules={[{ required: true }]} hasFeedback>
            <Select
              options={categories.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> name='supplierId' label='Supplier' rules={[{ required: true }]} hasFeedback>
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> label='Name' name='name' rules={[{ required: true }]} hasFeedback>
            <Input />
          </Form.Item>
          {/* PRICE */}
          <Form.Item<FieldType> label='Price' name='price' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} />
          </Form.Item>

          {/* DISCOUNT */}
          <Form.Item<FieldType> label='Discount' name='discount' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} max={90} />
          </Form.Item>
          {/* STOCK */}
          <Form.Item<FieldType> label='Stock' name='stock' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item<FieldType> label='Description' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
