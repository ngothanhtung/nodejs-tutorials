/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Form, Layout, Row } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Badge, Button } from 'antd';

const socketServerUrl = 'http://127.0.0.1:9000';
const apiServerUrl = 'http://127.0.0.1:9000';

const config = {
  secure: true,
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionAttempts: 20,
  // transports: ['polling'],
};

export default function TeacherQuiz() {
  const [answers, setAnswers] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);

  const [currectQuestionIndex, setCurrectQuestionIndex] = React.useState(-1);

  let socket = io(socketServerUrl, config);
  socket.on('connect', () => {
    console.log(`Socket is connected with id: ${socket.id}`);
  });
  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      if (data.type === 'quiz-answer') {
        const tmp = answers;
        tmp.push({ username: data.username, option: data.option });
        setAnswers([...tmp]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    axios.get(`${apiServerUrl}/questions`).then((response) => {
      console.log(response.data);
      setQuestions(response.data);
    });
  }, []);

  return (
    <Row gutter={[24, 24]}>
      <Col>
        {questions &&
          questions.map((q, index) => {
            return (
              <div key={q._id} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32, width: 32, borderRadius: 16, backgroundColor: index === currectQuestionIndex ? 'orange' : 'white' }}>{index + 1}</div>
                <div style={{ marginLeft: 12 }}>
                  <span>{q.title}</span>
                </div>
              </div>
            );
          })}

        <Button
          style={{ marginRight: 8 }}
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
          disabled={currectQuestionIndex + 1 >= questions?.length}
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
      </Col>
      <Col>
        {answers.map((a) => {
          return (
            <div>
              <span>{a.username}: </span>
              <span>{a.option.isCorrect.toString()} </span>
            </div>
          );
        })}
      </Col>
    </Row>
  );
}
