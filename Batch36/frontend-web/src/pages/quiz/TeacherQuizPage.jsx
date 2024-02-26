/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row } from 'antd';
import React from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Button } from 'antd';

export default function TeacherQuizPage() {
  const [answers, setAnswers] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(-1);

  let socket = io('http://localhost:9000', {
    secure: true,
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionAttempts: 20,
  });

  React.useEffect(() => {
    // SOCKET: LISTEN
    socket.on('server-message', (data) => {
      console.log(data);
      if (data.type === 'quiz-answer') {
        const tmp = answers;
        tmp.push({ username: data.username, option: data.option });
        setAnswers([...tmp]);
      }
    });

    return () => {
      socket.off('server-message');
    };
  }, []);

  React.useEffect(() => {
    axios.get(`http://localhost:9000/questions`).then((response) => {
      // console.log(response.data);
      setQuestions(response.data);
    });
  }, []);

  return (
    <div style={{ padding: 36 }}>
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
                type: 'quiz-question',
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
                type: 'quiz-question',
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
    </div>
  );
}
