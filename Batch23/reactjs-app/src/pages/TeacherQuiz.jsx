import { Button, Form, Layout } from 'antd';
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
  console.log(`Socket is connected with id: ${socket.id}`);
});

export default function TeacherQuiz() {
  const [answers, setAnswers] = React.useState([]);

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      if (data.type === 'quiz-answer') {
        const tmp = answers;
        tmp.push({ username: data.username, option: data.option });
        setAnswers([...tmp]);
      }
    });
  }, []);

  const [form] = Form.useForm();

  return (
    <div>
      <Layout>
        <Layout.Content style={{ padding: 24 }}>
          <Button
            onClick={() => {
              socket.emit('client-message', {
                type: 'quiz',
                question: {
                  title: 'Chiến thắng Điện Biên Phủ vào năm nào?',
                  options: [
                    { text: 1945, isCorrect: false },
                    { text: 1954, isCorrect: true },
                    { text: 1968, isCorrect: false },
                    { text: 1975, isCorrect: false },
                  ],
                },
              });
            }}
          >
            Start
          </Button>

          {answers.map((a) => {
            return (
              <div>
                <span>{a.username}: </span>
                <span>{a.option.isCorrect.toString()} </span>
              </div>
            );
          })}
        </Layout.Content>
      </Layout>
    </div>
  );
}
