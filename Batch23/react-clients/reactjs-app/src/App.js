import React from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import './App.css';
import Categories from './pages/Categories';
import Home from './pages/Home';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
          {/* ROUTES SETTINGS */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/categories' element={<Categories />} />

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
