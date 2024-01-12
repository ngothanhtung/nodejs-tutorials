import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal } from 'antd';
import { useRequest } from 'ahooks';
import React from 'react';
import { axiosClient } from '../../libraries/axiosClient';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

type Props = {};

type FieldType = {
  name: string;
  description?: string;
};

const checkNameUnique = async (name: string) => {
  try {
    const res = await axiosClient.get(`/categories/check?name=${name}`);
    console.log(res.data);
    return res.data.ok;
  } catch (error) {
    return false;
  }
};

export default function Categories({}: Props) {
  const { data, run: checkNameUniqueDebounce } = useRequest(checkNameUnique, {
    debounceWait: 300,
    manual: true,
    cacheTime: 0,
  });

  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const getCategories = async () => {
    try {
      const response = await axiosClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  const onFinish = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/categories', values);
      getCategories();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (id: number) => {
    try {
      await axiosClient.delete(`/categories/${id}`);
      getCategories();
      message.success('Category deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/categories/${selectedCategory._id}`, values);
      getCategories();
      setSelectedCategory(null);
      message.success('Category updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      width: '1%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '1%',
      render: (text: any, record: any) => {
        return (
          <Space size='small'>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedCategory(record);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm
              title='Delete the category'
              description='Are you sure to delete this category?'
              onConfirm={() => {
                onDelete(record._id);
              }}
            >
              <Button type='primary' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 36 }}>
      <Card title='Create new category' style={{ width: '100%' }}>
        <Form form={createForm} name='create-category' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onFinish}>
          <Form.Item<FieldType>
            label='Name'
            name='name'
            rules={[
              { required: true, message: 'Please input name!' },
              {
                validator(rule, value, callback) {
                  checkNameUniqueDebounce(value);
                  console.log(data);
                  if (data === true) {
                    callback('Name must be unique!');
                  } else {
                    callback();
                  }
                },
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='Description' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title='List of categories' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={categories} columns={columns} />
      </Card>

      <Modal
        centered
        title='Edit category'
        open={selectedCategory}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedCategory(null);
        }}
      >
        <Form form={updateForm} name='update-category' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onUpdate}>
          <Form.Item<FieldType> label='Name' name='name' rules={[{ required: true, message: 'Please input name!' }]} hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label='Description' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
