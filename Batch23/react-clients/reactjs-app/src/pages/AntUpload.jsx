import React from 'react';
import { Layout, message, Upload, Button } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { UploadOutlined } from '@ant-design/icons';

export default function AntUpload() {
  return (
    <Layout>
      <Content>
        <Upload
          showUploadList={false}
          name='file'
          data={{ message: 'Hellow' }}
          action='http://localhost:9000/upload/products/633be1165e3ab8be04c8b421'
          headers={{ authorization: 'authorization-text' }}
          onChange={(info) => {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }

            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Content>
    </Layout>
  );
}
