import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AddRole = ({ onAdd }) => {
  const [form] = Form.useForm();

  const handleAddRole = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/add-role`, {
        role_name: values.roleName,
      });

      if (response.data.success) {
        message.success('Role đã được thêm thành công!');
        form.resetFields();
        onAdd(response.data.data);
      } else {
        message.error('Thêm role không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error("Lỗi khi thêm role:", error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm role.');
    }
  };

  return (
    <Form form={form} onFinish={handleAddRole} layout="inline">
      <Form.Item
        name="roleName"
        rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
      >
        <Input placeholder="Nhập tên quyền" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Thêm Role</Button>
      </Form.Item>
    </Form>
  );
};

export default AddRole;
