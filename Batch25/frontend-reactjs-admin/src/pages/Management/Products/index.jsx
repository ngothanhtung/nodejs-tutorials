import React from 'react';
import { Image, Table, Button, Popconfirm, Form, Input, message, Space, Modal, InputNumber, Select, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';

import { axiosClient } from '../../../libraries/axiosClient';
import moment from 'moment';
import numeral from 'numeral';
import { API_URL } from '../../../constants/URLS';
import axios from 'axios';

export default function Products() {
  const [isPreview, setIsPreview] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);

  const [file, setFile] = React.useState(null);

  const columns = [
    {
      title: 'Hình ảnh',
      key: 'imageUrl',
      dataIndex: 'imageUrl',
      width: '1%',
      render: (text, record) => {
        return (
          <div>
            {text && (
              <React.Fragment>
                <Image
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsPreview(true);
                  }}
                  preview={{
                    visible: false,
                  }}
                  width={60}
                  src={`${API_URL}${text}`}
                />
                <div
                  style={{
                    display: 'none',
                  }}
                >
                  <Image.PreviewGroup
                    preview={{
                      visible: isPreview && record._id === selectedRecord?._id,
                      onVisibleChange: (vis) => setIsPreview(vis),
                    }}
                  >
                    <Image src={`${API_URL}${text}`} />
                    {record &&
                      record.images &&
                      record.images.map((image) => {
                        return <Image key={image} src={`${API_URL}${image}`} />;
                      })}
                  </Image.PreviewGroup>
                </div>
              </React.Fragment>
            )}
          </div>
        );
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => {
        return <strong>{record?.category?.name}</strong>;
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text) => {
        return <span>{numeral(text).format('0,0$')}</span>;
      },
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (text) => {
        return <span>{numeral(text).format('0,0')}%</span>;
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (text) => {
        return <span>{numeral(text).format('0,0.0')}</span>;
      },
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (text, record) => {
        return <strong>{record?.supplier?.name}</strong>;
      },
    },
    {
      title: 'Hình chi tiết',
      dataIndex: 'images',
      key: 'images',
      render: (text, record) => {
        if (record.images) {
          return (
            <Button
              onClick={() => {
                console.log('selectedRecord', record);
                // setSelectedRecord(record);
              }}
            >
              Xem
            </Button>
          );
        }
        return <React.Fragment></React.Fragment>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: '1%',
      render: (text, record) => {
        return (
          <Space>
            <Popconfirm
              style={{ width: 800 }}
              title='Are you sure to delete?'
              onConfirm={() => {
                // DELETE
                const id = record._id;
                axiosClient
                  .delete('/products/' + id)
                  .then((response) => {
                    message.success('Xóa thành công!');
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    message.error('Xóa bị lỗi!');
                  });
                console.log('DELETE', record);
              }}
              onCancel={() => {}}
              okText='Đồng ý'
              cancelText='Đóng'
            >
              <Button danger type='dashed' icon={<DeleteOutlined />} />
            </Popconfirm>
            <Button
              type='dashed'
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                console.log('Selected Record', record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
            <Upload
              showUploadList={false}
              name='file'
              action={API_URL + '/upload/products/' + record._id}
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
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axiosClient.get('/suppliers').then((response) => {
      setSuppliers(response.data);
      // console.log(response.data);
    });
  }, []);

  React.useEffect(() => {
    axiosClient.get('/categories').then((response) => {
      setCategories(response.data);
      // console.log(response.data);
    });
  }, []);

  React.useEffect(() => {
    axiosClient.get('/products').then((response) => {
      setProducts(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post('/products', values)
      .then((response) => {
        // UPLOAD FILE
        const { _id } = response.data;

        const formData = new FormData();
        formData.append('file', file);

        axios
          .post(API_URL + '/upload/products/' + _id, formData)
          .then((respose) => {
            message.success('Thêm mới thành công!');
            createForm.resetFields();
            setRefresh((f) => f + 1);
          })
          .catch((err) => {
            message.error('Upload file bị lỗi!');
          });
      })
      .catch((err) => {
        message.error('Thêm mới bị lỗi!');
      });
  };
  const onFinishFailed = (errors) => {
    console.log('🐣', errors);
  };

  const onUpdateFinish = (values) => {
    axiosClient
      .patch('/products/' + selectedRecord._id, values)
      .then((response) => {
        message.success('Cập nhật thành công!');
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error('Cập nhật bị lỗi!');
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log('🐣', errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  return (
    <div>
      <Form form={createForm} name='create-form' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='on'>
        <Form.Item label='Danh mục sản phẩm' name='categoryId' rules={[{ required: true, message: 'Chưa nhập Tên sản phẩm' }]} hasFeedback>
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

        <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Chưa nhập Tên sản phẩm' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label='Giá bán' name='price' rules={[{ required: true, message: 'Chưa nhập Giá bán' }]} hasFeedback>
          <InputNumber
            style={{ minWidth: 300 }}
            // formatter={(value) => {
            //   return numeral(value).format('0,0');
            // }}
          />
        </Form.Item>

        <Form.Item label='Giảm giá' name='discount'>
          <InputNumber style={{ minWidth: 300 }} />
        </Form.Item>
        <Form.Item label='Tồn kho' name='stock'>
          <InputNumber style={{ minWidth: 300 }} />
        </Form.Item>
        <Form.Item label='Nhà cung cấp' name='supplierId' rules={[{ required: true, message: 'Chưa nhập Tên sản phẩm' }]} hasFeedback>
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
        <Form.Item label='Hình minh họa' name='file'>
          <Upload
            showUploadList={true}
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey='_id' dataSource={products} columns={columns} pagination={false} />
      <Modal
        centered
        open={editFormVisible}
        title='Cập nhật thông tin'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText='Lưu thông tin'
        cancelText='Đóng'
      >
        <Form form={updateForm} name='update-form' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onUpdateFinish} onFinishFailed={onUpdateFinishFailed} autoComplete='on'>
          <Form.Item label='Danh mục sản phẩm' name='categoryId' rules={[{ required: true, message: 'Chưa nhập Tên sản phẩm' }]} hasFeedback>
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

          <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Chưa nhập Tên sản phẩm' }]} hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label='Giá bán' name='price' rules={[{ required: true, message: 'Chưa nhập Giá bán' }]} hasFeedback>
            <InputNumber style={{ minWidth: 300 }} />
          </Form.Item>

          <Form.Item label='Giảm giá' name='discount'>
            <InputNumber />
          </Form.Item>
          <Form.Item label='Tồn kho' name='stock'>
            <InputNumber />
          </Form.Item>
          <Form.Item label='Nhà cung cấp' name='supplierId' rules={[{ required: true, message: 'Chưa nhập Tên sản phẩm' }]} hasFeedback>
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
        </Form>
      </Modal>
    </div>
  );
}
