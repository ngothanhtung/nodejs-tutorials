import { socketConfigs } from 'constants/SETTINGS';
import { SOCKET_URL } from 'constants/URLS';
import React from 'react';
import { io } from 'socket.io-client';

let socket = io(SOCKET_URL, socketConfigs);
socket.on('connect', () => {
  console.log(`Socket is connected with id: ${socket.id}`);
});

type Props = {};

export default function ChatPage({}: Props) {
  const [messages, setMessages] = React.useState([]);
  const [username, setUsername] = React.useState('');
  const [messageText, setMessageText] = React.useState('');

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      console.log('data', data);
      const tmp = messages;
      tmp.push(data);
      setMessages([...tmp]);
    });
  }, []);

  return (
    <div>
      <h1>Chat</h1>
      <div className='flex flex-col'>
        {messages.map((m, index) => {
          return (
            <div key={`message-${index}`}>
              <strong>{m.username}:</strong>
              <span>{m.messageText}</span>
            </div>
          );
        })}

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            name='username'
            className='border-gray-100'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            name='messageText'
            onChange={(e) => {
              setMessageText(e.target.value);
            }}
          />
          <button
            type='submit'
            className='button'
            onClick={() => {
              console.log('username', username);
              console.log('messageText', messageText);

              socket.emit('client-message', {
                type: 'chat',
                username,
                messageText,
              });
            }}
          >
            Send
          </button>
        </form>
      </div>

      <button
        onClick={() => {
          socket.emit('client-message', {
            type: 'join',
            room: 'private-chat',
          });
        }}
      >
        Join to Room (Private)
      </button>
      <button
        onClick={() => {
          socket.emit('client-message', {
            type: 'join',
            room: 'friends-chat',
          });
        }}
      >
        Join to Room (friends)
      </button>
    </div>
  );
}
