import React from 'react';
import axios from 'axios';
import { Button, Form, Input, Table, Popconfirm, message, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { apiServerUrl } from './constants/URL';
import './App.css';

function App() {
  const [fresh, setRefresh] = React.useState(0);
  const [visible, setVisible] = React.useState(false);
  const [categories, setCategories] = React.useState(null);

  const [selectedRow, setSelectedRow] = React.useState(null);

  React.useEffect(() => {
    axios.get(`${apiServerUrl}/categories`).then((respose) => {
      setCategories(respose.data);
      console.log(respose.data);
    });
  }, [fresh]);

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: '1%',
      align: 'right',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: '700' }}>{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '',
      key: 'actions',
      width: '1%',
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              type='dashed'
              icon={<EditOutlined />}
              style={{ fontWeight: '600' }}
              onClick={() => {
                setVisible(true);
                setSelectedRow(record);
                editForm.setFieldValue('name', record.name);
                editForm.setFieldValue('description', record.description);
              }}
            />
            <Popconfirm
              placement='topLeft'
              title='Bạn có muốn xóa không?'
              onConfirm={() => {
                const { id } = record;
                // DELETE
                axios.delete(`${apiServerUrl}/categories/${id}`).then((response) => {
                  message.success('Xóa danh mục thành công!');
                  setRefresh((r) => r + 1);
                });
              }}
              okText='Yes'
              cancelText='No'
            >
              <Button danger type='dashed' icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const onFinish = (values) => {
    console.log(values);
    // POST

    axios.post(`${apiServerUrl}/categories`, values).then((respose) => {
      message.success('Tạo danh mục thành công!');
      setRefresh((r) => r + 1);
      createForm.resetFields();
    });
  };

  const onFinishFailed = (error) => {};

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  return (
    <div style={{ padding: 24 }}>
      {/* FORM */}
      <Form form={createForm} name='create-category' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='off'>
        <Form.Item label='Tên sản phẩm' name='name' rules={[{ required: true, message: 'Please input category name' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label='Mô tả' name='description'>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {/* TABLE */}
      <Table rowKey='id' dataSource={categories} columns={columns} pagination={false} />

      {/* MODAL */}
      <Modal
        title='Chỉnh sửa thông tin danh mục'
        open={visible}
        onOk={() => {
          editForm.submit();
        }}
        okText='Lưu thông tin'
        cancelText='Đóng'
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          form={editForm}
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
            axios.patch('http://127.0.0.1:9000/categories/' + selectedRow.id, values).then((response) => {
              if (response.status === 200) {
                setRefresh((r) => r + 1);
                setVisible(false);
              }
            });
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
    </div>
  );
}

export default App;
