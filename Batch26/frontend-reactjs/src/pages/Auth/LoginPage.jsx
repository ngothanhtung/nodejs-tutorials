import React from 'react';
import { Form, Input, Button, Checkbox, Divider } from 'antd';
import { useAuthStore } from '../../hooks/useAuthStore';

const LoginPage = () => {
  const { login } = useAuthStore((state) => state);

  const onFinish = async (values) => {
    const { username, password } = values;
    login({ username, password });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <React.Fragment>
      <h3>Login</h3>
      <Divider />
      <Form name='login-form' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} initialValues={{ username: '', password: '', remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='off'>
        <Form.Item
          label='Email'
          name='username'
          rules={[
            { required: true, message: 'Email không được để trống' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder='Nhập email' />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: true, message: 'Mật khẩu không được để trống' },
            { min: 6, max: 10, message: 'Độ dài mật khẩu phải nằm trong khoảng 6 đến 10 ký tự' },
          ]}
        >
          <Input.Password placeholder='Nhập mật khẩu' />
        </Form.Item>

        <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit' style={{ minWidth: 120 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

export default LoginPage;
