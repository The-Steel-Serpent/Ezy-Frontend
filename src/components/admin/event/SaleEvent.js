import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Modal, Form, Input, DatePicker, Button, Upload, Select } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import uploadFile from '../../../helpers/uploadFile';

const { Option } = Select;

const SaleEvent = () => {
    const [saleEvents, setSaleEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [settingForm] = Form.useForm(); // Form riêng cho thiết lập danh mục
    const [thumbnail, setThumbnail] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventCategories, setEventCategories] = useState([]);

    useEffect(() => {
        fetchSaleEvents();
        fetchCategories();
    }, []);

    const fetchSaleEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-event`);
            setSaleEvents(response.data.data);
        } catch (error) {
            console.error('Error fetching sale events:', error);
            message.error('Failed to load sale events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categories`);
            setCategories(res.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to load categories. Please try again later.');
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
                started_at: startDate.toISOString(),
                ended_at: endDate.toISOString(),
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

    const handleSetCategories = async (eventId, selectedCategories) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/set-categories/${eventId}`, {
                category_ids: selectedCategories,
            });
            message.success('Cài đặt danh mục thành công');
            fetchSaleEvents();
        } catch (error) {
            message.error('Lỗi khi cài đặt danh mục cho sự kiện.');
        } finally {
            setIsSettingModalVisible(false);
        }
    };

    const handleOpenSetupCategories = async (eventId) => {
        setSelectedEvent(eventId);
        setEventCategories([]);
        settingForm.resetFields();
        setIsSettingModalVisible(true);
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-categories/${eventId}`);
            
            if (response.data.success) {
                const selectedCategories = response.data.data;
                setEventCategories(selectedCategories);
                settingForm.setFieldsValue({ categories: selectedCategories });
            } else {
                settingForm.setFieldsValue({ categories: [] });
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error.response?.data?.message || error.message);
        }
    };
    

    const handleSettingModalOk = async (values) => {
        if (selectedEvent) {
            await handleSetCategories(selectedEvent, values.categories);
        }
    };

    const handleThumbnailChange = ({ fileList }) => {
        setThumbnail(fileList);
    };

    const handleDeleteEvent = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa sự kiện',
            content: (
                <div>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>Bạn có chắc chắn muốn xóa sự kiện này?</p>
                </div>
            ),
            okText: 'Có, xóa ngay',
            okType: 'danger',
            cancelText: 'Không, quay lại',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            onOk: async () => {
                setLoading(true);
                try {
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/delete-event/${id}`);
                    message.success('Xóa sự kiện thành công');
                    fetchSaleEvents();
                } catch (error) {
                    message.error('Lỗi khi xóa sự kiện.');
                } finally {
                    setLoading(false);
                }
            },
            okButtonProps: {
                style: {
                    backgroundColor: 'red',
                    borderColor: 'red',
                    color: 'white',
                },
            },
        });
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
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleOpenSetupCategories(record.sale_events_id)}
                    >
                        Thiết lập
                    </Button>
                    <Button 
                        type="primary" 
                        danger 
                        onClick={() => handleDeleteEvent(record.sale_events_id)} 
                        style={{ marginLeft: '8px' }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        }
    ];

    return (
        <div>
            <h1>Sự kiện khuyến mãi</h1>
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
                        rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Thumbnail"
                        rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={beforeUpload}
                            fileList={thumbnail}
                            onChange={handleThumbnailChange}
                            maxCount={1}
                        >
                            <Button>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        label="Ngày bắt đầu"
                        name="started_at"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        label="Ngày kết thúc"
                        name="ended_at"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Tạo sự kiện
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thiết lập danh mục cho sự kiện"
                visible={isSettingModalVisible}
                onCancel={() => setIsSettingModalVisible(false)}
                footer={null}
            >
                <Form form={settingForm} layout="vertical" onFinish={handleSettingModalOk}>
                    <Form.Item
                        label="Chọn danh mục"
                        name="categories"
                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một danh mục!' }]}
                    >
                        <Select mode="multiple" placeholder="Chọn danh mục">
                            {categories.map((category) => (
                                <Option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SaleEvent;
