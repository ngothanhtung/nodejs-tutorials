import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './App.css';
import List from './pages/employees';

function App() {
  return (
    <div style={{ padding: 48 }}>
      <BrowserRouter>
        <Routes>
          <Route path='/employees' element={<List />} />

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
    </div>
  );
}

export default App;
