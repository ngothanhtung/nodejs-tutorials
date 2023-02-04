import axios from 'axios';
import React from 'react';
import { Button, Form, Input, Modal, Space, Table } from 'antd';
import moment from 'moment';

export default function CustomerPage() {
  const [refresh, setRefresh] = React.useState(0);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const [customers, setCustomers] = React.useState([]);

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
    // {
    //   title: 'Họ',
    //   dataIndex: 'firstName',
    //   key: 'firstName',
    // },
    // {
    //   title: 'Tên',
    //   dataIndex: 'lastName',
    //   key: 'lastName',
    // },
    {
      title: 'Họ và tên',
      key: 'fullName',
      render: (text, record, index) => {
        return (
          <div>
            <strong>
              {record.firstName} {record.lastName}
            </strong>
          </div>
        );
      },
    },
    {
      title: 'Thư điện tử',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },

    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <strong>{moment(text).format('DD/MM/yyyy')}</strong>
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
            <Button onClick={() => selectCustomer(record)}>Sửa</Button>
            <Button onClick={() => deleteCustomer(record.id)}>Xóa</Button>
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axios.get('http://localhost:9000/customers').then((response) => {
      setCustomers(response.data);
      // console.log(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    console.log(values);
    // CODE HERE ...
    // CALL API TO CREATE CUSTOMER
    axios.post('http://localhost:9000/customers', values).then((response) => {
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
    axios.patch('http://localhost:9000/customers/' + selectedCustomer.id, values).then((response) => {
      if (response.status === 200) {
        updateForm.resetFields();
        setEditModalVisible(false);
        setRefresh((f) => f + 1);
      }
    });
  };

  const selectCustomer = (data) => {
    setEditModalVisible(true);
    setSelectedCustomer(data);
    updateForm.setFieldsValue(data);
    console.log(data);
  };

  const deleteCustomer = (id) => {
    axios.delete('http://localhost:9000/customers/' + id).then((response) => {
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
        name='create-customer'
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
          label='Họ'
          name='firstName'
          rules={[
            {
              required: true,
              message: 'Please input your first name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* LAST NAME */}
        <Form.Item
          label='Tên'
          name='lastName'
          rules={[
            {
              required: true,
              message: 'Please input your last name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          label='Thư điện tử'
          name='email'
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
            {
              type: 'email',
              message: 'Please input your valid email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Số điện thoại'
          name='phoneNumber'
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input />
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
      <Table rowKey='id' dataSource={customers} columns={columns} pagination={false} />

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
          name='update-customer'
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onEditFinish}
        >
          {/* FIRST NAME */}
          <Form.Item
            label='Họ'
            name='firstName'
            rules={[
              {
                required: true,
                message: 'Please input your first name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* LAST NAME */}
          <Form.Item
            label='Tên'
            name='lastName'
            rules={[
              {
                required: true,
                message: 'Please input your last name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            label='Thư điện tử'
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please input your valid email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Số điện thoại'
            name='phoneNumber'
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
