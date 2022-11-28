import React from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ChakraProvider, Button, Heading } from '@chakra-ui/react';

const socketServerUrl = 'http://127.0.0.1:9000';
const apiServerUrl = 'http://127.0.0.1:9000';

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

const alphabet = 'ABCDEF';

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
    <ChakraProvider>
      {question && (
        <div>
          <Heading as='h2' size={'md'} style={{ marginBlock: 24 }}>
            {question.title}
          </Heading>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {question.options.map((option, index) => {
              return (
                <Button
                  colorScheme='teal'
                  variant='outline'
                  style={{ marginBottom: 12 }}
                  justifyContent='flex-start'
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
                  {alphabet[index]}. {option.text}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </ChakraProvider>
  );
}
