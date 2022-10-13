import { Button, Form, Input, Layout } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';

const socketServerUrl = 'http://localhost:9000';

const config = {
  secure: true,
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
  // transports: ['polling'],
};

let socket = io(socketServerUrl, config);
socket.on('connect', () => {
  // eslint-disable-next-line no-console
  console.log(`Socket is connected with id: ${socket.id}`);
});

export default function Realtime() {
  React.useEffect(() => {
    // SOCKET: JOIN ROOM
    socket.emit('client-message', { message: 'Hello Socket from client' });

    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      console.log('Message from server:', data);
    });
  }, []);

  const [form] = Form.useForm();

  return (
    <div>
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
              name: '',
              message: '',
            }}
            onFinish={(values) => {
              // SUBMIT
              socket.emit('client-message', values);
            }}
            onFinishFailed={(error) => {
              console.error(error);
            }}
            autoComplete='off'
          >
            <Form.Item
              label='Họ và tên'
              name='name'
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Họ và tên: Chưa nhập',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Nội dung'
              name='message'
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Nội dung: Chưa nhập',
                },
              ]}
            >
              <Input />
            </Form.Item>
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
        </Layout.Content>
      </Layout>
    </div>
  );
}
