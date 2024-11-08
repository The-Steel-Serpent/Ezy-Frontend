import { Modal, Form, Input, Button, message } from 'antd';
import React, { useEffect } from 'react';
import axios from 'axios';

const EditRole = ({ role, isVisible, onClose, onUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (role) {
      form.setFieldsValue({ role_name: role.role_name });
    }
  }, [role, form]);

  const handleUpdate = async (values) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/update-role/${role.role_id}`, values);
      if (response.data.success) {
        message.success('Role đã được cập nhật thành công!');
        onUpdate(response.data.data);
        onClose();
      } else {
        message.error(response.data.message || 'Cập nhật role thất bại!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Tên role đã tồn tại, vui lòng chọn tên khác!') {
        message.error('Tên role đã tồn tại, vui lòng chọn tên khác!');
      } else {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      }
    }
  };
  

  return (
    <Modal
      title="Cập nhật Role"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdate}>
        <Form.Item
          name="role_name"
          label="Tên quyền"
          rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRole;
