import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import numeral from 'numeral';
import 'numeral/locales/vi';

import './App.css';
import Categories from './pages/Categories';
import Products from './pages/Products';

import Upload from './pages/Upload';
import Home from './pages/Home';
import AntUpload from './pages/AntUpload';
import ManualAntUpload from './pages/ManualAntUpload';
import Realtime from './pages/Realtime';
import TeacherQuiz from './pages/TeacherQuiz';
import StudentQuiz from './pages/StudentQuiz';
import { Col, Layout, Row, Dropdown, Space, Menu, Avatar, Button } from 'antd';
import Login from './pages/Login';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import useAuth from './hooks/useAuth';
const { Header, Content } = Layout;

numeral.locale('vi');

function App() {
  const { signOut, auth } = useAuth((state) => state);
  return (
    <React.Fragment>
      <BrowserRouter>
        <Layout>
          <Header style={{ paddingLeft: 16, paddingRight: 16 }}>
            <Row gutter={[0, 0]}>
              <Col flex={1}>
                <h1 style={{ color: 'white' }}>REACT CLIENT</h1>
              </Col>
              <Col>
                {!auth && (
                  <Link style={{ color: 'white' }} to='/login'>
                    Đăng nhập
                  </Link>
                )}
                {auth && (
                  <Dropdown
                    overlay={
                      <Menu style={{ marginTop: 22 }}>
                        <Menu.Item key='user'>
                          <Space>
                            <UserOutlined />
                            <span>Xin chào: {auth.payload.email}</span>
                          </Space>
                        </Menu.Item>
                        <Menu.Item key='settings'>
                          <Space>
                            <SettingOutlined />
                            Cấu hình tài khoản
                          </Space>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          key='signOut'
                          onClick={() => {
                            signOut();
                          }}
                        >
                          <Space>
                            <LogoutOutlined />
                            Thoát
                          </Space>
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <span>
                      <Avatar size='default' className='avatar' src={'https://i.pravatar.cc/150?img=45'} alt='avatar' />
                    </span>
                  </Dropdown>
                )}
              </Col>
            </Row>
          </Header>

          <Content style={{ padding: '24px', backgroundColor: 'white', height: 'calc(100vh - 64px)' }}>
            {/* ROUTES SETTINGS */}
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/categories' element={<Categories />} />

              <Route path='/products' element={<Products />} />
              <Route path='/upload' element={<Upload />} />
              <Route path='/antd/upload' element={<AntUpload />} />
              <Route path='/antd/upload/manual' element={<ManualAntUpload />} />
              <Route path='/realtime' element={<Realtime />} />
              <Route path='/login' element={<Login />} />
              <Route path='/quiz/teacher' element={<TeacherQuiz />} />
              <Route path='/quiz/student' element={<StudentQuiz />} />

              {/* NO MATCH ROUTE */}
              <Route
                path='*'
                element={
                  <main style={{ padding: '1rem' }}>
                    <p>404 Page not found 😂😂😂</p>
                  </main>
                }
              />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
