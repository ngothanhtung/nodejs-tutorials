import React from 'react';
import { Table, Button, Popconfirm, Form, Input, message, Space, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { axiosClient } from '../../../libraries/axiosClient';
import moment from 'moment';

export default function Employees() {
  const [employees, setEmployees] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => {
        return <strong style={{ color: 'blue' }}>{text}</strong>;
      },
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text) => {
        return <em>{text}</em>;
      },
    },
    {
      title: 'Thư điện tử',
      dataIndex: 'email',
      key: 'email',
      width: '1%',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '1%',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: '1%',
      render: (text) => {
        return <span>{moment(text).format('DD/MM/yyyy')}</span>;
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
                  .delete('/employees/' + id)
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
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axiosClient.get('/employees').then((response) => {
      setEmployees(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post('/employees', values)
      .then((response) => {
        message.success('Thêm mới thành công!');
        createForm.resetFields();
        setRefresh((f) => f + 1);
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
      .patch('/employees/' + selectedRecord._id, values)
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
        <Form.Item label='Họ' name='firstName' rules={[{ required: true, message: 'Chưa nhập Họ' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label='Tên' name='lastName' rules={[{ required: true, message: 'Chưa nhập Tên' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label='Số điện thoại' name='phoneNumber' rules={[{ required: true, message: 'Chưa nhập Số điện thoại' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item
          hasFeedback
          label='Thư điện tử'
          name='email'
          rules={[
            { required: true, message: 'Chưa nhập Thư điện tử' },
            { type: 'email', message: 'Thư điện tử không hợp lệ' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Chưa nhập Địa chỉ' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label='Ngày sinh' name='birthday'>
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey='_id' dataSource={employees} columns={columns} />
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
          <Form.Item label='Họ' name='firstName' rules={[{ required: true, message: 'Chưa nhập Họ' }]} hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label='Tên' name='lastName' rules={[{ required: true, message: 'Chưa nhập Tên' }]} hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label='Số điện thoại' name='phoneNumber' rules={[{ required: true, message: 'Chưa nhập Số điện thoại' }]} hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label='Thư điện tử'
            name='email'
            rules={[
              { required: true, message: 'Chưa nhập Thư điện tử' },
              { type: 'email', message: 'Thư điện tử không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Chưa nhập Địa chỉ' }]} hasFeedback>
            <Input />
          </Form.Item>

          <Form.Item label='Ngày sinh' name='birthday'>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
