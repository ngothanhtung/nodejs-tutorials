import { Button, Layout } from 'antd';
import React from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socketServerUrl = 'http://localhost:9000';
const apiServerUrl = 'http://localhost:9000';

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

export default function StudentQuiz() {
  const [username, setUsername] = React.useState('ductv@softech.vn');
  const [question, setQuestion] = React.useState(null);

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      console.log(data);
      if (data.type === 'quiz') {
        setQuestion(data.question);
      }
    });
  }, []);

  return (
    <div>
      <Layout>
        <Layout.Content style={{ padding: 24 }}>
          <h1>QUIZ</h1>
          {question && (
            <div>
              <h3>{question.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {question.options.map((option, index) => {
                  return (
                    <Button
                      style={{ marginBottom: 12 }}
                      key={'option-' + index}
                      onClick={() => {
                        // Call api to save to database
                        axios
                          .post(`${apiServerUrl}/questions/answer`, {
                            question: question._id,
                            username: username,
                            score: option.isCorrect ? question.score : 0,
                          })
                          .then((response) => {
                            socket.emit('client-message', { type: 'quiz-answer', username: username, option });
                          });
                      }}
                    >
                      {option.text}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </Layout.Content>
      </Layout>
    </div>
  );
}
