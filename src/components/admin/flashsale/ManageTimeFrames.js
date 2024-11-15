import React, { useEffect, useState } from 'react';
import { Modal, Table, Button, DatePicker, message, Popconfirm, Select } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const ManageTimeFrames = ({ visible, onClose, flashSaleId, flashSaleStart, flashSaleEnd }) => {
    const [timeFrames, setTimeFrames] = useState([]);
    const [editingTimeFrame, setEditingTimeFrame] = useState(null);
    const [startedAt, setStartedAt] = useState(null);
    const [endedAt, setEndedAt] = useState(null);
    const [status, setStatus] = useState('waiting'); // Default to "waiting"

    const fetchTimeFrames = async () => {
        console.log("Fetching time frames for flash sale ID:", flashSaleId);

        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/get-time-frames/${flashSaleId}`);
            if (response.data.success) {
                setTimeFrames(response.data.data);
            } else {
                message.error('Không thể tải dữ liệu khung giờ');
            }
        } catch (error) {
            console.error("Error fetching time frames:", error);
        }
    };

    useEffect(() => {
        if (flashSaleId) {
            // Clear previous data and reset form fields when flashSaleId changes
            setTimeFrames([]);
            setStartedAt(null);
            setEndedAt(null);
            setStatus('waiting');
            fetchTimeFrames();
        }
    }, [flashSaleId]);

    const handleAddTimeFrame = async () => {
        if (!startedAt || !endedAt) {
            return message.warning('Vui lòng cung cấp đầy đủ thông tin');
        }

        if (startedAt.isBefore(dayjs(flashSaleStart)) || endedAt.isAfter(dayjs(flashSaleEnd))) {
            return message.warning('Khung giờ phải nằm trong thời gian của Flash Sale');
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/add-time-frame/${flashSaleId}`, {
                flash_sales_id: flashSaleId,
                started_at: startedAt.toISOString(),
                ended_at: endedAt.toISOString(),
                status: "waiting", // Set status to "waiting" by default
            });
            if (response.data.success) {
                message.success('Thêm khung giờ thành công');
                fetchTimeFrames();
                setStartedAt(null);
                setEndedAt(null);
                setStatus('waiting'); // Reset to default
            }
        } catch (error) {
            message.error('Lỗi khi thêm khung giờ');
        }
    };

    const handleEditTimeFrame = (timeFrame) => {
        setEditingTimeFrame(timeFrame);
        setStartedAt(dayjs(timeFrame.started_at));
        setEndedAt(dayjs(timeFrame.ended_at));
        setStatus(timeFrame.status);
    };

    const handleUpdateTimeFrame = async () => {
        if (!startedAt || !endedAt || !status) {
            return message.warning('Vui lòng cung cấp đầy đủ thông tin');
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/update-time-frame/${editingTimeFrame.flash_sale_time_frame_id}`, {
                started_at: startedAt.toISOString(),
                ended_at: endedAt.toISOString(),
                status,
            });
            if (response.data.success) {
                message.success('Cập nhật khung giờ thành công');
                fetchTimeFrames();
                setEditingTimeFrame(null);
                setStartedAt(null);
                setEndedAt(null);
                setStatus('waiting'); // Reset to default for next addition
            }
        } catch (error) {
            message.error('Lỗi khi cập nhật khung giờ');
        }
    };

    const handleDeleteTimeFrame = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/delete-time-frame/${id}`);
            if (response.data.success) {
                message.success('Xóa khung giờ thành công');
                fetchTimeFrames();
            }
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const columns = [
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'started_at',
            key: 'started_at',
            render: (text) => dayjs(text).format('HH:mm:ss DD/MM/YYYY'),
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'ended_at',
            key: 'ended_at',
            render: (text) => dayjs(text).format('HH:mm:ss DD/MM/YYYY'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button icon={<EditOutlined />} onClick={() => handleEditTimeFrame(record)} style={{ marginRight: 8 }}>
                        Chỉnh sửa
                    </Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa khung giờ này?" onConfirm={() => handleDeleteTimeFrame(record.flash_sale_time_frame_id)} okText="Có" cancelText="Không">
                        <Button icon={<DeleteOutlined />} style={{ backgroundColor: 'red', color: 'white' }}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <Modal
            title="Quản lý khung giờ Flash Sale"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>

                <DatePicker showTime placeholder="Chọn thời gian bắt đầu" value={startedAt} onChange={(value) => setStartedAt(value)} />
                <DatePicker showTime placeholder="Chọn thời gian kết thúc" value={endedAt} onChange={(value) => setEndedAt(value)} />
                {editingTimeFrame ? (
                    <Select value={status} onChange={setStatus} placeholder="Chọn trạng thái" style={{ width: '150px' }}>
                        <Option value="waiting">Waiting</Option>
                        <Option value="active">Active</Option>
                        <Option value="ended">Ended</Option>
                    </Select>
                ) : (
                    <span style={{ width: '150px' }}></span> 
                )}
                {editingTimeFrame ? (
                    <Button type="primary" onClick={handleUpdateTimeFrame}>Cập nhật</Button>
                ) : (
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTimeFrame}>Thêm khung giờ</Button>
                )}
            </div>
            <Table columns={columns} dataSource={timeFrames} rowKey="flash_sale_time_frame_id" />
        </Modal>
    );
};

export default ManageTimeFrames;
