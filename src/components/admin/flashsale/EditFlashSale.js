import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message, Upload } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import uploadFile from '../../../helpers/uploadFile';

const EditFlashSale = ({ visible, onClose, onEditSuccess, flashSaleData }) => {
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (flashSaleData) {
      form.setFieldsValue({
        flash_sales_name: flashSaleData.flash_sales_name,
        description: flashSaleData.description,
        started_at: dayjs(flashSaleData.started_at),
        ended_at: dayjs(flashSaleData.ended_at),
      });
      if (flashSaleData.thumbnail) {
        setThumbnail([
          {
            uid: '-1',
            name: 'current_thumbnail',
            status: 'done',
            url: flashSaleData.thumbnail,
          },
        ]);
      }
    }
  }, [flashSaleData, form]);

  const handleThumbnailChange = ({ fileList }) => {
    setThumbnail(fileList.slice(-1));
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ hỗ trợ file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let thumbnailUrl = flashSaleData.thumbnail;

      if (thumbnail.length > 0 && thumbnail[0]?.originFileObj) {
        const uploadedFile = await uploadFile(thumbnail[0].originFileObj, 'event-img');
        thumbnailUrl = uploadedFile.secure_url;
      }

      const payload = {
        flash_sales_name: values.flash_sales_name,
        description: values.description,
        started_at: values.started_at.format('YYYY-MM-DD HH:mm:ss'),
        ended_at: values.ended_at.format('YYYY-MM-DD HH:mm:ss'),
        thumbnail: thumbnailUrl,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/update/${flashSaleData.flash_sales_id}`,
        payload
      );

      if (response.data.success) {
        message.success('Cập nhật Flash Sale thành công');
        onEditSuccess();
        onClose();
      } else {
        message.error('Cập nhật Flash Sale thất bại');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Chỉnh sửa Flash Sale" visible={visible} onCancel={onClose} footer={null}>
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

        <Form.Item label="Thumbnail">
          <Upload
            listType="picture"
            fileList={thumbnail}
            beforeUpload={beforeUpload}
            onChange={handleThumbnailChange}
          >
            {thumbnail.length === 0 && <Button>Chọn ảnh</Button>}
          </Upload>
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="started_at"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
        >
          <DatePicker showTime format="HH:mm:ss DD/MM/YYYY" placeholder="Chọn thời gian bắt đầu" />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name="ended_at"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
        >
          <DatePicker showTime format="HH:mm:ss DD/MM/YYYY" placeholder="Chọn thời gian kết thúc" />
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
