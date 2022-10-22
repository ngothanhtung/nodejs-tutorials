import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { Layout } from 'antd';
const { Header, Content } = Layout;

numeral.locale('vi');

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Layout>
          <Header>
            <h1 style={{ color: 'white' }}>REACT CLIENT</h1>
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
