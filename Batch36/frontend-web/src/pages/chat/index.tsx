import { Button, Card, Form, Input, Select } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';
let socket = io('http://127.0.0.1:9000', {
  secure: true,
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
});

socket.on('connect', () => {
  console.log(`Socket is connected with id: ${socket.id}`);
});

type Props = {};

export default function Chat({}: Props) {
  const [currentRoom, setCurrentRoom] = React.useState(null);
  const [username, setUsername] = React.useState(null);

  const [messages, setMessages] = React.useState<any[]>([]);

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      console.log('data', data);

      if (data.type === 'chat' && data.room === currentRoom) {
        setMessages((x) => {
          return [...x, data];
        });
      }
    });

    return () => {
      socket.off('server-message');
    };
  }, []);

  const onFinish = (values: any) => {
    socket.emit('client-message', {
      type: 'chat',
      room: currentRoom,
      username: username,
      message: values.message,
    });
  };

  return (
    <div style={{ padding: 36 }}>
      {!currentRoom && (
        <Card title='Join' style={{}}>
          <Form
            name='join'
            layout='inline'
            onFinish={(values: any) => {
              setCurrentRoom(values.room);
              setUsername(values.username);
              socket.emit('client-message', {
                type: 'join',
                room: values.room,
              });
            }}
            initialValues={{ room: 'room1' }}
          >
            <Form.Item name='room'>
              <Select
                style={{ width: 100 }}
                options={[
                  { label: 'Room 1', value: 'room1' },
                  { label: 'Room 2', value: 'room2' },
                ]}
              />
            </Form.Item>
            <Form.Item name='username' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Join
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {currentRoom && (
        <Card title='Chat' style={{}}>
          <Form name='chat' layout='inline' onFinish={onFinish} initialValues={{ room: 'room1' }}>
            <Form.Item name='message'>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Send
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      <div>
        {messages.map((message: any, index: number) => {
          return (
            <div key={`message-${index}`}>
              <strong>{message.username}:</strong>
              <span>{message.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
