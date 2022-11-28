import React from 'react';
import numeral from 'numeral';
import { Button, Layout, Table, Form, Input, Popconfirm, message, notification, Space, Modal, Upload, Select, InputNumber } from 'antd';

import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

import axios from 'axios';
import { WEB_SERVER_URL } from '../constants/URL';

export default function Products() {
  const columns = [
    {
      title: 'Hình ảnh',
      key: 'imageUrl',
      dataIndex: 'imageUrl',
      width: '1%',
      render: (text) => {
        return <div>{text && <img src={`${WEB_SERVER_URL}${text}`} style={{ width: 60 }} alt='' />}</div>;
      },
    },
    {
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      width: '40%',
      render: (text) => {
        return <span style={{ fontWeight: '600' }}>{text}</span>;
      },
    },
    {
      title: 'Giá bán',
      key: 'price',
      dataIndex: 'price',
      width: '1%',
      render: (text) => {
        return <div style={{ textAlign: 'right' }}> {numeral(text).format('0,0')}</div>;
      },
    },

    {
      title: 'Giảm',
      key: 'discount',
      dataIndex: 'discount',
      width: '1%',
      render: (text) => {
        return <div style={{ textAlign: 'right' }}> {numeral(text).format('0')}%</div>;
      },
    },

    {
      title: 'Tồn',
      key: 'stock',
      dataIndex: 'stock',
      width: '1%',
      render: (text) => {
        return <div style={{ textAlign: 'right' }}> {numeral(text).format('0,0')}</div>;
      },
    },

    {
      title: 'NCC',
      key: 'suppliers',
      dataIndex: 'supplier',
      width: '1%',
      render: (text, record) => {
        return <div style={{ textAlign: 'left' }}> {record?.supplier?.name}</div>;
      },
    },

    {
      title: '',
      key: 'actions',
      width: '1%',
      render: (text, record) => {
        return (
          <Space>
            <Upload
              showUploadList={false}
              name='file'
              data={{ message: 'Hello ANTD' }}
              action={'http://127.0.0.1:9000/upload/products/' + record._id}
              headers={{ authorization: 'authorization-text' }}
              onChange={(info) => {
                if (info.file.status !== 'uploading') {
                  console.log(info.file, info.fileList);
                }

                if (info.file.status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully`);

                  setRefresh((f) => f + 1);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button icon={<UploadOutlined />} />
            </Upload>
            <Button
              type='dashed'
              icon={<EditOutlined />}
              style={{ fontWeight: '600' }}
              onClick={() => {
                setVisible(true);
                setSelectedRow(record);
                formEdit.setFieldValue('name', record.name);
                formEdit.setFieldValue('description', record.description);
              }}
            />
            <Popconfirm
              overlayInnerStyle={{ width: 300 }}
              okText='Đồng ý'
              cancelText='Đóng'
              title='Are you sure?'
              onConfirm={() => {
                const { _id } = record;
                axios.delete('http://127.0.0.1:9000/products/' + _id).then((response) => {
                  if (response.status === 200) {
                    setRefresh((f) => f + 1);
                    message.info('Xóa thành công');
                  }
                });
              }}
            >
              <Button danger type='dashed' icon={<DeleteOutlined />} style={{ fontWeight: '600' }} onClick={() => {}}></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // const [file, setFile] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState(null);
  const [refresh, setRefresh] = React.useState(1);
  const [visible, setVisible] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  React.useEffect(() => {
    axios.get('http://127.0.0.1:9000/categories').then((response) => {
      // console.log(response.data.results);
      setCategories(response.data.results);
      form.setFieldValue('categoryId', response.data.results[0]._id);
    });
  }, []);

  React.useEffect(() => {
    axios.get('http://127.0.0.1:9000/products').then((response) => {
      // console.log(response.data.results);
      setProducts(response.data.results);
    });
  }, [refresh]);

  return (
    <Layout>
      <Layout.Content style={{ padding: 24 }}>
        <Form
          form={form}
          name='create'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            // categoryId: categories ? categories[0]._id : '',
            name: '',
            description: '',
            price: 0,
            discount: 0,
            stock: 0,
          }}
          onFinish={(values) => {
            console.log(values);

            // return;
            axios
              .post('http://127.0.0.1:9000/products', values)
              .then((response) => {
                if (response.status === 201) {
                  setRefresh((f) => f + 1);
                  form.resetFields();
                  notification.info({ message: 'Thông báo', description: 'Thêm mới thành công' });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
          onFinishFailed={(error) => {
            console.error(error);
          }}
          autoComplete='off'
        >
          <Form.Item label='Danh mục' name='categoryId' hasFeedback>
            <Select loading={!categories}>
              {categories &&
                categories.map((c) => {
                  return (
                    <Select.Option key={c._id} value={c._id}>
                      {c.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>

          <Form.Item
            label='Tên sản phẩm'
            name='name'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Tên sản phẩm: Chưa nhập',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Giá bán'
            name='price'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Giá bán: Chưa nhập',
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item label='Giảm giá' name='discount' hasFeedback>
            <InputNumber min={0} max={90} />
          </Form.Item>

          <Form.Item label='Tồn kho' name='stock' hasFeedback>
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item label='Mô tả' name='description'>
            <Input />
          </Form.Item>

          {/* <Form.Item label='Hình minh họa' name='file'>
            <Upload
              showUploadList={true}
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}
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
        <Table rowKey='_id' columns={columns} dataSource={products} pagination={false} />

        <Modal
          title='Chỉnh sửa thông tin danh mục'
          open={visible}
          onOk={() => {
            formEdit.submit();
          }}
          onCancel={() => {
            setVisible(false);
          }}
        >
          <Form
            form={formEdit}
            name='edit'
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              name: '',
              description: '',
            }}
            onFinish={(values) => {
              // SUBMIT
              axios.patch('http://127.0.0.1:9000/products/' + selectedRow._id, values).then((response) => {
                if (response.status === 200) {
                  setRefresh((f) => f + 1);
                  setVisible(false);
                }
              });
              console.log(values);
            }}
            onFinishFailed={(error) => {
              console.error(error);
            }}
            autoComplete='off'
          >
            <Form.Item
              label='Tên danh mục'
              name='name'
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Tên danh mục: Chưa nhập',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label='Mô tả' name='description'>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
