import React from 'react';
import { Layout, message, Upload, Button } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function ManualAntUpload() {
  const [file, setFile] = React.useState(null);

  return (
    <Layout>
      <Content style={{ padding: 12 }}>
        <Upload
          listType='text'
          showUploadList={true}
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>

        <Button
          onClick={() => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', 'Category 1234');
            formData.append('description', 'Mo ta 1234');

            axios.post('http://127.0.0.1:9000/upload/products/444555666', formData).then((respose) => {
              console.log(respose.data);
            });
          }}
        >
          Submit
        </Button>
      </Content>
    </Layout>
  );
}
