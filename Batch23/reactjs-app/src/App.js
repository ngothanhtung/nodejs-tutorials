import React from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import './App.css';
import Categories from './pages/Categories';
import Upload from './pages/Upload';
import Home from './pages/Home';
import AntUpload from './pages/AntUpload';
import Realtime from './pages/Realtime';
import TeacherQuiz from './pages/TeacherQuiz';
import StudentQuiz from './pages/StudentQuiz';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
          {/* ROUTES SETTINGS */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/upload' element={<Upload />} />
            <Route path='/antd/upload' element={<AntUpload />} />
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
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
