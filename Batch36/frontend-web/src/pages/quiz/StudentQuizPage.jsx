import React from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import { Button } from 'antd';

let socket = io('http://127.0.0.1:9000', {
  secure: true,
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
});

const alphabet = 'ABCDEF';

export default function StudentQuizPage() {
  const [username, setUsername] = React.useState('hocsinh@softech.vn');
  const [question, setQuestion] = React.useState(null);

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      console.log(data);
      if (data.type === 'quiz-question') {
        setQuestion(data.question);
      }
    });

    return () => {
      socket.off('server-message');
    };
  }, []);

  return (
    <div style={{ padding: 36 }}>
      {question && (
        <div>
          <h2 style={{ marginBlock: 24 }}>{question.title}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {question.options.map((option, index) => {
              return (
                <Button
                  key={option._id}
                  onClick={() => {
                    // Call api to save to database
                    const score = option.isCorrect ? question.score : 0;

                    axios
                      .post(`http://localhost:9000/questions/answer`, {
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
    </div>
  );
}
