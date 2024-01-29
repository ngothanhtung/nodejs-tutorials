import { Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, TableColumnsType, message } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import { axiosClient } from '../../libraries/axiosClient';
import { CalendarOutlined, DeleteOutlined, EditOutlined, FolderAddOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import numeral from 'numeral';

type FieldType = {
  customerId: string;
  employeeId: string;
  status: string;
  paymentType: string;
  shippedDate?: string;
  shippingCity?: string;
  shippingAddress?: string;
  description?: string;
};

type Props = {};

export default function Orders({}: Props) {
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [selectedOrderToAddOrderDetails, setSelectedOrderToAddOrderDetails] = React.useState<any>(null);

  const [customers, setCustomers] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);

  // Search products
  const [products, setProducts] = React.useState([]);

  // Selected products
  const [selectedProducts, setSelectedProducts] = React.useState<any[]>([]);

  const getOrders = async () => {
    try {
      const response = await axiosClient.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getCustomers = async () => {
    try {
      const response = await axiosClient.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getEmployees = async () => {
    try {
      const response = await axiosClient.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getCustomers();
    getEmployees();
    getOrders();
  }, []);

  const onFinish = async (values: FieldType) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/orders', values);
      getOrders();
      createForm.resetFields();
      message.success('Create order successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/orders/${id}`);
      getOrders();
      message.success('Order deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/orders/${selectedOrder._id}`, values);
      getOrders();
      setSelectedOrder(null);
      message.success('Order updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onFinishSearchProducts = async (values: any) => {
    try {
      let name = values.name;
      const response = await axiosClient.get(`/products/search?name=${name}`);
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {}
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (text: string, record: any, index: number) => {
        return <div style={{ textAlign: 'right' }}>{index + 1}</div>;
      },
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      fixed: 'left',
      width: 200,
      children: [
        {
          title: 'Name',
          dataIndex: 'customer-name',
          key: 'customer-name',

          render: (text: string, record: any, index: number) => {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Space>
                  <UserOutlined />
                  <span>{record.customer.firstName + ' ' + record.customer.lastName}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Phone',
          dataIndex: 'customer-phone',
          key: 'customer-phone',

          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <PhoneOutlined />
                  <span>{record.customer.phoneNumber}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Email',
          dataIndex: 'customer-email',
          key: 'customer-email',

          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <MailOutlined />
                  <span>{record.customer.email}</span>
                </Space>
              </div>
            );
          },
        },
      ],
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      children: [
        {
          title: 'Name',
          dataIndex: 'employee-name',
          key: 'employee-name',
          render: (text: string, record: any, index: number) => {
            return (
              <div style={{ whiteSpace: 'nowrap' }}>
                <Space>
                  <UserOutlined />
                  <span>{record.employee.firstName + ' ' + record.employee.lastName}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Phone',
          dataIndex: 'employee-phone',
          key: 'employee-phone',
          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <PhoneOutlined />
                  <span>{record.employee.phoneNumber}</span>
                </Space>
              </div>
            );
          },
        },
        {
          title: 'Email',
          dataIndex: 'employee-email',
          key: 'employee-email',
          render: (text: string, record: any, index: number) => {
            return (
              <div>
                <Space>
                  <MailOutlined />
                  <span>{record.employee.email}</span>
                </Space>
              </div>
            );
          },
        },
      ],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: 'nowrap' }}>Payment Type</div>;
      },
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Space>
              <CalendarOutlined />
              <span>{dayjs(text).format('DD MMM YYYY HH:mm')}</span>
            </Space>
          </div>
        );
      },
    },
    {
      title: 'Shipped Date',
      dataIndex: 'shippedDate',
      key: 'shippedDate',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <Space>
              {text && <CalendarOutlined />}
              <span> {text ? dayjs(text).format('DD MMM YYYY HH:mm') : ''}</span>
            </Space>
          </div>
        );
      },
    },

    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 120,
      render: (text: string, record: any, index: number) => {
        return <span>{text}</span>;
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',

      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <Space size='small'>
            <Button
              type='primary'
              icon={<FolderAddOutlined />}
              onClick={() => {
                setSelectedOrderToAddOrderDetails(record);
              }}
            />

            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm title='Delete the order' description='Are you sure to delete this order?' onConfirm={() => {}}>
              <Button type='primary' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const products_columns: TableColumnsType<any> = [
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
      <Card title='Create new order' style={{ width: '100%' }}>
        <Form
          name='create-order'
          form={createForm}
          initialValues={{
            status: 'WAITING',
            paymentType: 'CASH',
          }}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item<FieldType> name='customerId' label='Customer'>
            <Select
              options={customers.map((item: any) => {
                return {
                  label: item.firstName + ' ' + item.lastName + ' - ' + item.email + ' - ' + item.phoneNumber,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> name='employeeId' label='Employee'>
            <Select
              options={employees.map((item: any) => {
                return {
                  label: item.firstName + ' ' + item.lastName + ' - ' + item.email + ' - ' + item.phoneNumber,
                  value: item._id,
                };
              })}
            />
          </Form.Item>
          <Form.Item<FieldType> name='paymentType' label='Payment Type'>
            <Select
              options={[
                {
                  label: 'Cash',
                  value: 'CASH',
                },
                {
                  label: 'Credit Card',
                  value: 'CREDIT CARD',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<FieldType> name='description' label='Description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title='List of orders' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={orders} columns={columns} bordered scroll={{ x: 1800 }} />
      </Card>

      <Modal
        centered
        width={800}
        title='Edit order'
        open={selectedOrder}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedOrder(null);
        }}
      >
        <Form form={updateForm} name='update-order' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{}} onFinish={onUpdate}>
          <Form.Item<FieldType> name='customerId' label='Customer'>
            <Select
              disabled
              options={customers.map((item: any) => {
                return {
                  label: item.firstName + ' ' + item.lastName + ' - ' + item.email + ' - ' + item.phoneNumber,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> name='employeeId' label='Employee'>
            <Select
              options={employees.map((item: any) => {
                return {
                  label: item.firstName + ' ' + item.lastName + ' - ' + item.email + ' - ' + item.phoneNumber,
                  value: item._id,
                };
              })}
            />
          </Form.Item>

          <Form.Item<FieldType> name='status' label='Status'>
            <Select
              options={[
                {
                  label: 'Waiting',
                  value: 'WAITING',
                },
                {
                  label: 'Completed',
                  value: 'COMPLETED',
                },
                {
                  label: 'Cancelled',
                  value: 'CANCELLED',
                },
              ]}
            />
          </Form.Item>

          <Form.Item<FieldType> name='paymentType' label='Payment Type'>
            <Select
              options={[
                {
                  label: 'Cash',
                  value: 'CASH',
                },
                {
                  label: 'Credit Card',
                  value: 'CREDIT CARD',
                },
              ]}
            />
          </Form.Item>
          <Form.Item<FieldType> name='shippingAddress' label='Shipping Address'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item<FieldType> name='shippedDate' label='Shipped Date'>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> name='description' label='Description'>
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ADD ORDER DETAILS */}

      <Modal
        centered
        width={800}
        title='Add products to order'
        open={selectedOrderToAddOrderDetails}
        okText='Add to order'
        onOk={async () => {
          // 1. selectedOrderToAddOrderDetails
          // 2. selectedProducts (quantity = 1)
          try {
            let orderDetails = selectedProducts.map((p: any) => {
              return {
                productId: p._id,
                quantity: 1,
                price: p.price,
                discount: p.discount,
              };
            });

            console.log('orderDetails', orderDetails);

            const result = await axiosClient.patch(`/orders/${selectedOrderToAddOrderDetails._id}`, {
              orderDetails: orderDetails,
            });

            setSelectedOrderToAddOrderDetails(null);
            setSelectedProducts([]);
          } catch (error) {
            console.log('Error:', error);
          }
        }}
        onCancel={() => {
          setSelectedOrderToAddOrderDetails(null);
        }}
      >
        <Form name='search-products' layout='inline' onFinish={onFinishSearchProducts}>
          <Form.Item name='name' label='Name'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Search
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowKey='_id'
          columns={products_columns}
          dataSource={products}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
              // console.log(selectedRows);
              setSelectedProducts(selectedRows);
            },
          }}
        />
      </Modal>
    </div>
  );
}
