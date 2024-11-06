import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const EditFlashSale = ({ visible, onClose, onEditSuccess, flashSaleData }) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (flashSaleData) {
      form.setFieldsValue({
        flash_sales_name: flashSaleData.flash_sales_name,
        description: flashSaleData.description,
        started_at: dayjs(flashSaleData.started_at),
        ended_at: dayjs(flashSaleData.ended_at),
        status: flashSaleData.status,
      });
    }
  }, [flashSaleData, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        flash_sales_name: values.flash_sales_name,
        description: values.description,
        started_at: values.started_at.format('YYYY-MM-DD HH:mm:ss'),
        ended_at: values.ended_at.format('YYYY-MM-DD HH:mm:ss'),
        status: values.status,
      };

      const response = await axios.put(`http://localhost:8080/api/flash-sales/update/${flashSaleData.flash_sales_id}`, payload);
      
      if (response.data.success) {
        message.success('Cập nhật Flash Sale thành công');
        onEditSuccess();
        onClose();
      } else {
        message.error('Cập nhật Flash Sale thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa Flash Sale"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" onFinish={onFinish} form={form}>
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
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFlashSale;
