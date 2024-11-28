import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload, message } from 'antd';
import uploadFile from '../../../helpers/uploadFile';
import axios from 'axios';
import dayjs from 'dayjs';

const AddSaleEvent = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState([]);

    const handleCreateEvent = async (values) => {
        try {
            const startDate = dayjs(values.started_at).format('YYYY-MM-DD HH:mm:ss');
            const endDate = dayjs(values.ended_at).format('YYYY-MM-DD HH:mm:ss');

            if (dayjs(values.ended_at).isBefore(dayjs(values.started_at))) {
                message.error('Ngày kết thúc phải sau ngày bắt đầu.');
                return;
            }

            setLoading(true);
            let thumbnailUrl = '';
            if (thumbnail.length > 0) {
                const uploadedFile = await uploadFile(thumbnail[0].originFileObj, 'event-img');
                thumbnailUrl = uploadedFile.secure_url;
            }

            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/add-event`, {
                sale_events_name: values.sale_events_name,
                thumbnail: thumbnailUrl,
                started_at: startDate,
                ended_at: endDate,
            });

            message.success('Tạo sự kiện thành công');
            onSuccess();
            onClose();
            form.resetFields();
            setThumbnail([]);
        } catch (error) {
            message.error('Lỗi khi tạo sự kiện.');
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

    return (
        <Modal
            title="Tạo sự kiện khuyến mãi"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} onFinish={handleCreateEvent}>
                <Form.Item
                    label="Tên sự kiện"
                    name="sale_events_name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Thumbnail">
                    <Upload
                        beforeUpload={beforeUpload}
                        onChange={handleThumbnailChange}
                        fileList={thumbnail}
                        maxCount={1}
                        onRemove={() => setThumbnail([])}
                    >
                        {thumbnail.length === 0 && (
                            <Button>Chọn ảnh</Button>
                        )}
                    </Upload>
                    {thumbnail.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                            <img
                                src={thumbnail[0].preview}
                                alt={`Thumbnail for ${thumbnail[0].name}`}
                                style={{ width: 100 }}
                            />
                        </div>
                    )}
                </Form.Item>
                <Form.Item
                    label="Ngày bắt đầu"
                    name="started_at"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item
                    label="Ngày kết thúc"
                    name="ended_at"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                >
                    <DatePicker showTime />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Tạo sự kiện
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSaleEvent;
