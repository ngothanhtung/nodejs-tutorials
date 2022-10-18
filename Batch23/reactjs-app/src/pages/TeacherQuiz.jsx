import { Form, Layout } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Text, Badge, Button } from '@chakra-ui/react';

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

export default function TeacherQuiz() {
  const [answers, setAnswers] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);

  const [currectQuestionIndex, setCurrectQuestionIndex] = React.useState(-1);

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

  React.useEffect(() => {
    axios.get(`${apiServerUrl}/questions`).then((response) => {
      console.log(response.data);
      setQuestions(response.data);
    });
  }, []);

  const [form] = Form.useForm();

  return (
    <div>
      <Layout>
        <Layout.Content style={{ padding: 24 }}>
          {questions &&
            questions.map((q, index) => {
              return (
                <div key={q._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <Badge colorScheme={index === currectQuestionIndex ? 'red' : 'gray'}>{index + 1}</Badge>
                  </div>
                  <div>
                    <Text>{q.title}</Text>
                  </div>
                </div>
              );
            })}

          <Button
            style={{ marginRight: 8 }}
            colorScheme='teal'
            onClick={() => {
              setCurrectQuestionIndex(0);

              socket.emit('client-message', {
                type: 'quiz',
                question: questions[0],
              });
            }}
          >
            Bắt đầu
          </Button>
          <Button
            colorScheme='teal'
            onClick={() => {
              const newIndex = currectQuestionIndex + 1;
              setCurrectQuestionIndex(newIndex);

              socket.emit('client-message', {
                type: 'quiz',
                question: questions[newIndex],
              });
            }}
          >
            Câu tiếp theo
          </Button>
          {/* <Button
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
          </Button> */}

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
