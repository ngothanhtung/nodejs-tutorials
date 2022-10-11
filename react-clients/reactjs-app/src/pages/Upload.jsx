import React from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function Upload() {
  return (
    <Layout>
      <Content>
        <form enctype='multipart/form-data' action='http://localhost:9000/upload/products/633be1165e3ab8be04c8b421' method='post'>
          <input type='file' name='file' />
          <input type='submit' value='Upload Image' name='submit' />
        </form>
      </Content>
    </Layout>
  );
}
