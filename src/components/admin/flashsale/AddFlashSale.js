import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import axios from 'axios';

const AddFlashSale = ({ visible, onClose, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    // Kiểm tra ngày bắt đầu và ngày kết thúc
    const now = new Date();
    const startedAt = values.started_at.toDate(); // Chuyển đổi từ moment.js sang Date
    const endedAt = values.ended_at.toDate(); // Chuyển đổi từ moment.js sang Date

    if (startedAt <= now) {
      message.error('Ngày bắt đầu phải lớn hơn ngày hiện tại.');
      setLoading(false);
      return;
    }

    if (endedAt <= startedAt) {
      message.error('Ngày kết thúc phải sau ngày bắt đầu.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        flash_sales_name: values.flash_sales_name,
        description: values.description,
        started_at: startedAt.toISOString(), // Định dạng ngày giờ
        ended_at: endedAt.toISOString(), // Định dạng ngày giờ
        status: values.status,
      };

      console.log("Dữ liệu trước khi thêm:", payload);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/add`, payload);
      
      if (response.data.success) {
        message.success('Thêm Flash Sale thành công');
        onAddSuccess(); 
        onClose();
      } else {
        message.error('Thêm Flash Sale thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi thêm Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm Flash Sale"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên Flash Sale"
          name="flash_sales_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên Flash Sale' }]}
        >
          <Input placeholder="Nhập tên Flash Sale" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="started_at"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
        >
          <DatePicker
            showTime
            format="HH:mm:ss DD/MM/YYYY"
            placeholder="Chọn thời gian bắt đầu"
          />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name="ended_at"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
        >
          <DatePicker
            showTime
            format="HH:mm:ss DD/MM/YYYY"
            placeholder="Chọn thời gian kết thúc"
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}
        >
          <Input placeholder="Nhập trạng thái (e.g., Diễn ra, Sắp diễn ra)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFlashSale;
