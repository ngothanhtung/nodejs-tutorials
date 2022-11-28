import { Button, Form, Input, Layout, message } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';

const socketServerUrl = 'http://127.0.0.1:9000';

const config = {
  secure: true,
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
  // transports: ['polling'],
};

let socket = io(socketServerUrl, config);
socket.on('connect', () => {
  console.log(`Socket is connected with id: ${socket.id}`);
});

export default function Realtime() {
  const [username, setUsername] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      if (data.type === 'chat') {
        const tmp = messages;
        tmp.push(data);

        setMessages([...tmp]);
      }
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
              setUsername(values.name);
              socket.emit('client-message', { ...values, type: 'chat' });
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
              <Input disabled={username !== ''} />
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column  ' }}>
            {messages.map((m, index) => {
              return (
                <div key={'message-' + index} style={{ marginBottom: 8, flex: 1, display: 'flex' }}>
                  {username === m.name && (
                    <div style={{ flex: 1, display: 'flex' }}>
                      <div style={{ flex: 1 }}></div>
                      <div style={{ backgroundColor: 'blue', display: 'flex', flex: 0 }}>
                        {m.name}: {m.message}
                      </div>
                    </div>
                  )}

                  {username !== m.name && (
                    <div style={{ flex: 1, display: 'flex' }}>
                      <div style={{ backgroundColor: 'gray', display: 'flex', flex: 0 }}>
                        {m.name}: {m.message}
                      </div>
                      <div style={{ flex: 1 }}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
}
