/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Form, Layout, Row } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Badge, Button } from 'antd';
import { API_URL, SOCKET_URL } from 'constants/URLS';
import { socketConfigs } from 'constants/SETTINGS';

export default function TeacherQuizPage() {
  const [answers, setAnswers] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(-1);

  let socket = io(SOCKET_URL, socketConfigs);
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
    axios.get(`${API_URL}/questions`).then((response) => {
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32, width: 32, borderRadius: 16, backgroundColor: index === currentQuestionIndex ? 'orange' : 'white' }}>{index + 1}</div>
                <div style={{ marginLeft: 12 }}>
                  <span>{q.title}</span>
                </div>
              </div>
            );
          })}

        <Button
          style={{ marginRight: 8 }}
          onClick={() => {
            setCurrentQuestionIndex(0);

            socket.emit('client-message', {
              type: 'quiz',
              question: questions[0],
            });
          }}
        >
          Bắt đầu
        </Button>
        <Button
          disabled={currentQuestionIndex + 1 >= questions?.length}
          onClick={() => {
            const newIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(newIndex);

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
