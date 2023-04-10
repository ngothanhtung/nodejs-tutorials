import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { queryClient } from 'libraries/react-query';

import './App.css';

import { QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import CategoriesPage from 'pages/CategoriesPage';
import LegacyCategoriesPage from 'pages/LegacyCategoriesPage';
import ChatPage from 'pages/ChatPage';
import TeacherQuizPage from 'pages/TeacherQuizPage';
import StudentQuizPage from 'pages/StudentQuizPage';

function App() {
  return (
    <div style={{}}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Link to={'/'}>Home</Link> | <Link to={'/categories'}>Categories</Link> | <Link to={'/legacy-categories'}>Legacy Categories</Link>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/categories' element={<CategoriesPage />} />
            <Route path='/legacy-categories' element={<LegacyCategoriesPage />} />

            <Route path='/chat' element={<ChatPage />} />

            <Route path='/quiz/teacher' element={<TeacherQuizPage />} />
            <Route path='/quiz/student' element={<StudentQuizPage />} />
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
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
