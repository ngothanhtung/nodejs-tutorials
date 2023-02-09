import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button, Layout, Row } from 'antd';

import numeral from 'numeral';
import 'numeral/locales/vi';

import 'antd/dist/reset.css';
import './App.css';

import MainMenu from './components/MainMenu';
// PAGES
import HomePage from './pages/HomePage';
import CustomerPage from './pages/Management/CustomerPage';
import ProductPage from './pages/Management/ProductPage';

import NotFoundPage from './pages/NotFoundPage';
import DiscountPage from './pages/Sales/Products/DiscountPage';
import StockPage from './pages/Sales/Products/StockPage';
import FormUpload from './pages/Upload/FormUpload';
import AntUpload from './pages/Upload/AntUpload';

numeral.locale('vi');

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div>
      <BrowserRouter>
        <Layout>
          <Sider theme='dark' style={{ minHeight: '100vh' }}>
            <MainMenu />
          </Sider>
          <Layout>
            <Header style={{ backgroundColor: 'blue' }}>
              <h1 style={{ color: 'white' }}> ONLINE SHOP - ADMIN</h1>
            </Header>

            <Content style={{ padding: 24 }}>
              {/* Register routes */}
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/home' element={<HomePage />} />

                {/* MANAGEMENT */}
                <Route path='/management/products' element={<ProductPage />} />
                <Route path='/management/customers' element={<CustomerPage />} />

                {/* SALES */}
                <Route path='/sales/products/discount' element={<DiscountPage />} />
                <Route path='/sales/products/stock' element={<StockPage />} />

                {/* UPLOAD */}

                <Route path='/upload/form' element={<FormUpload />} />
                <Route path='/upload/antd' element={<AntUpload />} />
                {/* NO MATCH ROUTE */}
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
