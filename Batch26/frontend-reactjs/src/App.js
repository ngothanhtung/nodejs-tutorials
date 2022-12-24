import React from 'react';
import numeral from 'numeral';
import 'numeral/locales/vi';

import 'antd/dist/reset.css';
import './App.css';

// import CustomerPage from './pages/CustomerPage';
import ProductPage from './pages/ProductPage';

numeral.locale('vi');

function App() {
  return (
    <div className='App'>
      {/* <CustomerPage /> */}
      <ProductPage />
    </div>
  );
}

export default App;
