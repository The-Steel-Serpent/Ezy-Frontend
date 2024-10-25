import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Modal, Form, Input, DatePicker, Button, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import uploadFile from '../../../helpers/uploadFile';

const SaleEvent = () => {
    const [saleEvents, setSaleEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [thumbnail, setThumbnail] = useState([]);

    useEffect(() => {
        fetchSaleEvents();
    }, []);

    const fetchSaleEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-event`);
            setSaleEvents(response.data.data);
        } catch (error) {
            message.error('Failed to load sale events.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (values) => {
        try {
            const startDate = values.started_at;
            const endDate = values.ended_at;

            if (endDate.isBefore(startDate)) {
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
                started_at: startDate.toISOString(), // Sử dụng toISOString() để chuyển đổi ngày thành chuỗi
                ended_at: endDate.toISOString(),     // Sử dụng toISOString() để chuyển đổi ngày thành chuỗi
            });

            message.success('Tạo sự kiện thành công');
            setIsModalVisible(false);
            form.resetFields();
            setThumbnail([]);
            fetchSaleEvents();
        } catch (error) {
            message.error('Lỗi khi tạo sự kiện.');
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailChange = ({ fileList }) => {
        setThumbnail(fileList);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'sale_events_id',
            key: 'sale_events_id',
        },
        {
            title: 'Tên sự kiện',
            dataIndex: 'sale_events_name',
            key: 'sale_events_name',
        },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (text) => text ? <img src={text} alt="Thumbnail" style={{ width: 50 }} /> : 'No image',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'started_at',
            key: 'started_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'ended_at',
            key: 'ended_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <div>
            <h1>Sale Events</h1>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Tạo sự kiện mới
            </Button>

            <Table
                dataSource={saleEvents}
                columns={columns}
                rowKey="sale_events_id"
                loading={loading}
                style={{ marginTop: 20 }}
            />

            <Modal
                title="Tạo sự kiện"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateEvent}>
                    <Form.Item
                        label="Tên sự kiện"
                        name="sale_events_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
                    >
                        <Input placeholder="Nhập tên sự kiện" />
                    </Form.Item>

                    <Form.Item label="Thumbnail" name="thumbnail">
                        <Upload
                            name="file"
                            listType="picture"
                            maxCount={1}
                            beforeUpload={() => false}
                            onChange={handleThumbnailChange} // Handle thumbnail changes
                        >
                            <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Ngày bắt đầu"
                        name="started_at"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
                    >
                        <DatePicker showTime />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kết thúc"
                        name="ended_at"
                        rules={[{ required: true, message: 'Vui lòng nhập ngày kết thúc' }]}
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
        </div>
    );
};

export default SaleEvent;
