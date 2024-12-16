import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Upload, message } from 'antd';
import uploadFile from '../../../helpers/uploadFile';
import axios from 'axios';
import dayjs from 'dayjs';

const EditSaleEvent = ({ visible, onClose, eventId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState([]);

    useEffect(() => {
        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-event-by-id/${eventId}`);
            const event = response.data.data;

            // Set the existing thumbnail and form fields
            setThumbnail([{ url: event.thumbnail }]);
            form.setFieldsValue({
                sale_events_name: event.sale_events_name,
                started_at: dayjs(event.started_at),
                ended_at: dayjs(event.ended_at),
            });
        } catch (error) {
            message.error('Failed to load event details.');
        }
    };

    const handleThumbnailChange = (info) => {
        const fileList = info.fileList.slice(-1); // Only keep the latest file
        setThumbnail(fileList);

        if (info.file.originFileObj) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileList[0].preview = e.target.result;
                setThumbnail(fileList);
            };
            reader.readAsDataURL(info.file.originFileObj);
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

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            let thumbnailUrl = thumbnail[0]?.url || '';
            if (thumbnail[0]?.originFileObj) {
                const uploadedFile = await uploadFile(thumbnail[0].originFileObj, 'event-img');
                thumbnailUrl = uploadedFile.secure_url;
            }

            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/update-event/${eventId}`, {
                sale_events_name: values.sale_events_name,
                thumbnail: thumbnailUrl,
                started_at: values.started_at.toISOString(),
                ended_at: values.ended_at.toISOString(),
            });

            message.success('Cập nhập sự kiện thành công.');
            onSuccess();
            onClose();
        } catch (error) {
            message.error(error.response?.data?.message || 'Lổi khi chỉnh sửa sự kiện.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Edit Sale Event"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Event Name"
                    name="sale_events_name"
                    rules={[{ required: true, message: 'Please enter the event name' }]}
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
                                src={thumbnail[0].preview || thumbnail[0].url}
                                alt="Thumbnail"
                                style={{ width: 100 }}
                            />
                        </div>
                    )}
                </Form.Item>
                <Form.Item
                    label="Start Date"
                    name="started_at"
                    rules={[{ required: true, message: 'Please select the start date' }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item
                    label="End Date"
                    name="ended_at"
                    rules={[{ required: true, message: 'Please select the end date' }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Button type="primary" onClick={handleSave} loading={loading}>
                    Lưu
                </Button>
            </Form>
        </Modal>
    );
};

export default EditSaleEvent;
