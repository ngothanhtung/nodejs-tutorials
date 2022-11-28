import React from 'react';

import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const markdown = ``;

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth((state) => state);

  const onFinish = (values) => {
    const { username, password } = values;

    axios
      .post('http://127.0.0.1:9000/auth/login', { username, password })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem('auth', JSON.stringify(response.data));
        // Zustand: method
        signIn({ payload: response.data.payload, token: response.data.token });
        message.success('Login success');
        navigate('/');
      })
      .catch((err) => {
        if (err.response.status === 401) {
          message.error('Đăng nhập không thành công!');
        }
      });
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
      <Divider></Divider>
      <ReactMarkdown children={markdown}></ReactMarkdown>
    </React.Fragment>
  );
};

export default Login;
