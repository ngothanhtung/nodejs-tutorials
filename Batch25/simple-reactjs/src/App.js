import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import numeral from 'numeral';
import 'numeral/locales/vi';

import './App.css';
import Employees from './pages/Employees';
import Products from './pages/Products';

numeral.locale('vi');

function App() {
  return (
    <div style={{ padding: 48 }}>
      <BrowserRouter>
        <Routes>
          <Route path='/employees' element={<Employees />} />
          <Route path='/products' element={<Products />} />

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
