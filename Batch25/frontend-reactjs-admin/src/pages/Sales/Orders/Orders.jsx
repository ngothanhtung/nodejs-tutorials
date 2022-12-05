import React from 'react';
import { Table, Button, Card, Modal, Descriptions, Divider } from 'antd';
import { axiosClient } from '../../../libraries/axiosClient';
import numeral from 'numeral';

export default function Orders() {
  const [addProductsModalVisible, setAddProductsModalVisible] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  // Products
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    axiosClient.get('/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  const productColumns = [
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product.name',
      key: 'product.name',
      render: (text, record) => {
        return <strong>{record?.product?.name}</strong>;
      },
    },
    {
      title: 'Giá',
      dataIndex: 'product.price',
      key: 'product.price',
      render: (text, record) => {
        return <div style={{ textAlign: 'right' }}>{numeral(record?.product?.price).format('0,0$')}</div>;
      },
    },
    {
      title: 'Giảm giá',
      dataIndex: 'product.discount',
      key: 'product.discount',
      render: (text, record) => {
        return <div style={{ textAlign: 'right' }}>{numeral(record?.product?.discount).format('0,0')}%</div>;
      },
    },
    {
      title: '',

      key: 'actions',
      render: (text, record) => {
        return (
          <Button
            onClick={async () => {
              const currentProduct = record;
              console.log('currentProduct', currentProduct);
              const response = await axiosClient.get('orders/' + selectedOrder._id);
              const currentOrder = response.data;
              const { orderDetails } = currentOrder;
              const remainOrderDetails = orderDetails.filter((x) => {
                return x.productId.toString() !== currentProduct.productId.toString();
              });
              console.log('remainOrderDetails', remainOrderDetails);
              await axiosClient.patch('orders/' + selectedOrder._id, {
                orderDetails: remainOrderDetails,
              });

              setAddProductsModalVisible(false);
            }}
          >
            Xóa
          </Button>
        );
      },
    },
  ];

  // Orders
  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (text, record) => {
        return <strong>{record.customer?.fullName}</strong>;
      },
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: 'paymentType',
      key: 'paymentType',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },

    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
      render: (text, record) => {
        return <strong>{record.employee?.fullName}</strong>;
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => {
        const { orderDetails } = record;

        let total = 0;
        orderDetails.forEach((od) => {
          let sum = od.quantity * od.product.total;
          total = total + sum;
        });

        return <strong>{numeral(total).format('0,0$')}</strong>;
      },
    },
    {
      title: '',
      key: 'actions',
      render: (text, record) => {
        return (
          <Button
            onClick={() => {
              console.log('record', record);
              setSelectedOrder(record);
            }}
          >
            Select
          </Button>
        );
      },
    },
  ];

  const [orders, setOrders] = React.useState([]);
  React.useEffect(() => {
    axiosClient.get('/orders').then((response) => {
      setOrders(response.data);
    });
  }, []);

  return (
    <div>
      <Modal
        centered
        width={'90%'}
        title='Chi tiết đơn hàng'
        open={selectedOrder}
        onCancel={() => {
          setSelectedOrder(null);
        }}
      >
        {selectedOrder && (
          <div>
            <Descriptions bordered column={1} labelStyle={{ fontWeight: '700' }}>
              <Descriptions.Item label='Trạng thái'>{selectedOrder.status}</Descriptions.Item>
              <Descriptions.Item label='Khách hàng'>{selectedOrder.customer?.fullName}</Descriptions.Item>
              <Descriptions.Item label='Nhân viên'>{selectedOrder.employee?.fullName}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Table rowKey='_id' dataSource={selectedOrder.orderDetails} columns={productColumns} />

            <Button
              onClick={() => {
                setAddProductsModalVisible(true);
              }}
            >
              Thêm sản phẩm
            </Button>

            <Modal
              centered
              width={'80%'}
              title='Danh sách sản phẩm'
              open={addProductsModalVisible}
              onCancel={() => {
                setAddProductsModalVisible(false);
              }}
            >
              {products &&
                products.map((p) => {
                  return (
                    <Card key={p._id}>
                      <strong>{p.name}</strong>
                      <Button
                        onClick={async () => {
                          const response = await axiosClient.get('orders/' + selectedOrder._id);
                          const currentOrder = response.data;
                          const { orderDetails } = currentOrder;
                          const found = orderDetails.find((x) => x.productId === p._id);
                          if (found) {
                            found.quantity++;
                          } else {
                            orderDetails.push({
                              productId: p._id,
                              quantity: 1,
                            });
                          }

                          await axiosClient.patch('orders/' + selectedOrder._id, {
                            orderDetails,
                          });

                          setAddProductsModalVisible(false);
                          // RELOAD //
                        }}
                      >
                        Add
                      </Button>
                    </Card>
                  );
                })}
            </Modal>
          </div>
        )}
      </Modal>

      <Table rowKey='_id' dataSource={orders} columns={columns} />
    </div>
  );
}
