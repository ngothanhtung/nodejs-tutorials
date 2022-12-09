import React from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import { API_URL, SOCKET_URL } from 'constants/URLS';
import { socketConfigs } from 'constants/SETTINGS';
import { Button } from 'antd';

let socket = io(SOCKET_URL, socketConfigs);
socket.on('connect', () => {
  console.log(`Socket is connected with id: ${socket.id}`);
});
const alphabet = 'ABCDEF';

export default function StudentQuizPage() {
  const [username, setUsername] = React.useState('hocsinh@softech.vn');
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
    <React.Fragment>
      {question && (
        <div>
          <h2 style={{ marginBlock: 24 }}>{question.title}</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {question.options.map((option, index) => {
              return (
                <Button
                  key={option._id}
                  onClick={() => {
                    // Call api to save to database
                    const score = option.isCorrect ? question.score : 0;

                    axios
                      .post(`${API_URL}/questions/answer`, {
                        question: question._id,
                        username: username,
                        score: score,
                      })
                      .then((response) => {
                        socket.emit('client-message', { type: 'quiz-answer', username: username, option, score });
                      });
                  }}
                >
                  {alphabet[index]}. {option.text}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
