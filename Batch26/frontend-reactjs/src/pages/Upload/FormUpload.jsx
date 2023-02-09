import React from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';

export default function FormUpload() {
  return (
    <Layout>
      <Content>
        <form enctype='multipart/form-data' action='http://127.0.0.1:9000/upload/products/63aac49c97b26916b34edc34/image' method='post'>
          <input type='file' name='file' />
          <input type='text' name='name' />
          <input type='text' name='description' />
          <input type='submit' value='Upload' name='submit' />
        </form>
      </Content>
    </Layout>
  );
}
