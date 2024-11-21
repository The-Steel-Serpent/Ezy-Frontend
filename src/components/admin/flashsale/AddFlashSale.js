import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload, message } from 'antd';
import axios from 'axios';
import uploadFile from '../../../helpers/uploadFile';

const AddFlashSale = ({ visible, onClose, onAddSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const startedAt = values.started_at.toISOString();
      const endedAt = values.ended_at.toISOString();

      let thumbnailUrl = '';
      if (thumbnail.length > 0 && thumbnail[0]?.originFileObj) {
        try {
          const uploadedFile = await uploadFile(thumbnail[0].originFileObj, 'event-img');
          if (uploadedFile && uploadedFile.secure_url) {
            thumbnailUrl = uploadedFile.secure_url;
          } else {
            throw new Error('Không thể upload ảnh. Vui lòng thử lại.');
          }
        } catch (error) {
          message.error(error.message || 'Lỗi khi upload ảnh!');
          setLoading(false);
          return;
        }
      } else {
        message.warning('Vui lòng tải lên một hình ảnh hợp lệ!');
        setLoading(false);
        return;
      }

      const payload = {
        flash_sales_name: values.flash_sales_name,
        description: values.description,
        started_at: startedAt,
        ended_at: endedAt,
        status: 'waiting',
        thumbnail: thumbnailUrl,
      };

      console.log('Payload gửi đến API:', payload);

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/add`, payload);

      message.success('Thêm Flash Sale thành công');
      onAddSuccess();
      onClose();
    } catch (error) {
      message.error('Lỗi khi thêm Flash Sale');
      console.error('Lỗi chi tiết:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (info) => {
    const fileList = info.fileList.slice(-1);
    if (fileList.length > 0) {
      const file = fileList[0]?.originFileObj;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileList[0].preview = e.target.result; 
          setThumbnail(fileList); 
        };
        reader.readAsDataURL(file);
      } else {
        message.error('Không thể đọc dữ liệu file. Vui lòng thử lại!');
      }
    } else {
      setThumbnail([]);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ có thể upload file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleRemove = () => {
    setThumbnail([]);
  };

  return (
    <Modal title="Thêm Flash Sale" visible={visible} onCancel={onClose} footer={null}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên Flash Sale"
          name="flash_sales_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên Flash Sale!' }]}
        >
          <Input placeholder="Nhập tên Flash Sale" />
        </Form.Item>

        <Form.Item label="Thumbnail">
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleThumbnailChange}
            onRemove={handleRemove}
            fileList={thumbnail}
            maxCount={1}
          >
            {thumbnail.length === 0 && <Button>Chọn ảnh</Button>}
          </Upload>
          {thumbnail.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <img
                src={thumbnail[0]?.preview || ''}
                alt={`Thumbnail for ${thumbnail[0]?.name}`}
                style={{ width: 100 }}
              />
            </div>
          )}
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <Input.TextArea placeholder="Nhập mô tả" rows={4} />
        </Form.Item>
        
        <Form.Item
          label="Thời gian bắt đầu"
          name="started_at"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
        >
          <DatePicker showTime />
        </Form.Item>

        <Form.Item
          label="Thời gian kết thúc"
          name="ended_at"
          rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
        >
          <DatePicker showTime />
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
