import { Button, Layout, Row } from 'antd';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import numeral from 'numeral';
import 'numeral/locales/vi';

import './App.css';
import Employees from './pages/Management/Employees';
import Products from './pages/Management/Products';
import Products1 from './pages/Products';
import Home from './pages/Home';
import MainMenu from './components/MainMenu';
import SearchOrdersByStatus from './pages/Sales/Orders/SearchOrdersByStatus';
import Login from './pages/Login';
import Orders from './pages/Sales/Orders/Orders';
import Categories from './pages/Categories';
import FormUpload from './pages/Upload/FormUpload';
import AntUpload from './pages/Upload/AntUpload';
import ManualAntUpload from './pages/Upload/ManualAntUpload';

numeral.locale('vi');

const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div style={{}}>
      <BrowserRouter>
        <Layout>
          <Sider theme='dark' style={{ minHeight: '100vh' }}>
            <MainMenu />
          </Sider>
          <Layout>
            <Header>
              <Button
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                }}
              >
                Thoát
              </Button>
            </Header>

            <Content style={{ padding: 24 }}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/categories/:id/products' element={<Products1 />} />
                <Route path='/login' element={<Login />} />
                <Route path='/management/employees' element={<Employees />} />
                <Route path='/management/products' element={<Products />} />
                {/* SALES */}

                <Route path='/sales/orders' element={<Orders />} />
                <Route path='/sales/orders/status' element={<SearchOrdersByStatus />} />
                <Route path='/upload/form' element={<FormUpload />} />
                <Route path='/upload/antd' element={<AntUpload />} />
                <Route path='/upload/manual-antd' element={<ManualAntUpload />} />
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
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
