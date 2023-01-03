import axios from 'axios';
import React from 'react';
import { Button, Form, Input, InputNumber, Select, Modal, Space, Table, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';

export default function ProductPage() {
  const [refresh, setRefresh] = React.useState(0);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
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
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <span>{record.category.name}</span>
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
            <span>{record.supplier.name}</span>
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
    {
      title: '',
      key: 'actions',
      width: '1%',
      render: (text, record, index) => {
        return (
          <Space>
            <Button type='dashed' icon={<EditOutlined />} onClick={() => selectProduct(record)} />

            <Popconfirm
              title='Are you sure to delete?'
              okText='Đồng ý'
              cancelText='Đóng'
              onConfirm={() => {
                deleteProduct(record._id);
              }}
            >
              <Button danger type='dashed' icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axios.get('http://localhost:9000/suppliers').then((response) => {
      setSuppliers(response.data);
      // console.log(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get('http://localhost:9000/categories').then((response) => {
      setCategories(response.data);
      // console.log(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get('http://localhost:9000/products').then((response) => {
      setProducts(response.data);
      // console.log(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    console.log(values);
    // CODE HERE ...
    // CALL API TO CREATE CUSTOMER
    axios.post('http://localhost:9000/products', values).then((response) => {
      if (response.status === 201) {
        createForm.resetFields();
        setRefresh((f) => f + 1);
      }
      console.log(response.data);
    });
  };

  const onEditFinish = (values) => {
    console.log(values);
    // CODE HERE ...
    // CALL API TO CREATE CUSTOMER
    axios.patch('http://localhost:9000/products/' + selectedProduct.id, values).then((response) => {
      if (response.status === 200) {
        updateForm.resetFields();
        setEditModalVisible(false);
        setRefresh((f) => f + 1);
      }
    });
  };

  const selectProduct = (data) => {
    setEditModalVisible(true);
    setSelectedProduct(data);
    updateForm.setFieldsValue(data);
    console.log(data);
  };

  const deleteProduct = (id) => {
    axios.delete('http://localhost:9000/products/' + id).then((response) => {
      console.log(response);
      setRefresh((f) => f + 1);
    });
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  return (
    <div>
      {/* CREATE FORM  */}
      <Form
        form={createForm}
        name='create-product'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label='Danh mục sản phẩm'
          name='categoryId'
          rules={[
            {
              required: true,
              message: 'Please input product categpry!',
            },
          ]}
        >
          <Select
            options={
              categories &&
              categories.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label='Nhà cung cấp'
          name='supplierId'
          rules={[
            {
              required: true,
              message: 'Please input product supplier!',
            },
          ]}
        >
          <Select
            options={
              suppliers &&
              suppliers.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        {/* NAME */}
        <Form.Item
          label='Tên sản phẩm'
          name='name'
          rules={[
            {
              required: true,
              message: 'Please input product name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* PRICE */}
        <Form.Item
          label='Giá bán'
          name='price'
          rules={[
            {
              required: true,
              message: 'Please input product price!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        {/* DISCOUNT */}
        <Form.Item
          label='Giảm (%)'
          name='discount'
          rules={[
            {
              required: true,
              message: 'Please input product discount!',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        {/* STOCK */}
        <Form.Item
          label='Tồn'
          name='stock'
          rules={[
            {
              required: true,
              message: 'Please input product stock!',
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* SUBMIT */}
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type='primary' htmlType='submit'>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>

      {/* TABLE */}
      <Table rowKey='id' dataSource={products} columns={columns} pagination={false} />

      {/* MODAL */}
      <Modal
        open={editModalVisible}
        centered
        title='Cập nhật thông tin'
        onCancel={() => {
          setEditModalVisible(false);
        }}
        cancelText='Đóng'
        okText='Lưu thông tin'
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name='update-product'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onEditFinish}
        >
          <Form.Item
            label='Danh mục sản phẩm'
            name='categoryId'
            rules={[
              {
                required: true,
                message: 'Please input product categpry!',
              },
            ]}
          >
            <Select
              options={
                categories &&
                categories.map((c) => {
                  return {
                    value: c._id,
                    label: c.name,
                  };
                })
              }
            />
          </Form.Item>

          <Form.Item
            label='Nhà cung cấp'
            name='supplierId'
            rules={[
              {
                required: true,
                message: 'Please input product supplier!',
              },
            ]}
          >
            <Select
              options={
                suppliers &&
                suppliers.map((c) => {
                  return {
                    value: c._id,
                    label: c.name,
                  };
                })
              }
            />
          </Form.Item>

          {/* NAME */}
          <Form.Item
            label='Tên sản phẩm'
            name='name'
            rules={[
              {
                required: true,
                message: 'Please input product name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* PRICE */}
          <Form.Item
            label='Giá bán'
            name='price'
            rules={[
              {
                required: true,
                message: 'Please input product price!',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          {/* DISCOUNT */}
          <Form.Item
            label='Giảm (%)'
            name='discount'
            rules={[
              {
                required: true,
                message: 'Please input product discount!',
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          {/* STOCK */}
          <Form.Item
            label='Tồn'
            name='stock'
            rules={[
              {
                required: true,
                message: 'Please input product stock!',
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
