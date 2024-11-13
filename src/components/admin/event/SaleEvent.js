import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Modal, Button, Input, DatePicker } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddSaleEvent from './AddSaleEvent';
import SaleEventDetail from './SaleEventDetail';
import SettingSaleEvent from './SettingSaleEvent';
import EditSaleEvent from './EditSaleEvent';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL);

const SaleEvent = () => {
    const [saleEvents, setSaleEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [eventDetailVisible, setEventDetailVisible] = useState(false);
    const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    useEffect(() => {
        fetchSaleEvents();
    
        socket.on('saleEventStarted', (data) => {
            message.info(`Sale event ${data.saleEventId} has started.`);
            fetchSaleEvents(); 
        });
    
        socket.on('saleEventEnded', (data) => {
            message.warning(`Sale event ${data.saleEventId} has ended.`);
            fetchSaleEvents();
        });
    
        return () => {
            socket.off('saleEventStarted');
            socket.off('saleEventEnded');
        };
    }, []);

    const fetchSaleEvents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale-events/get-event`);
            setSaleEvents(response.data.data);
            setFilteredEvents(response.data.data);
        } catch (error) {
            message.error('Failed to load sale events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        applyFilters(saleEvents, keyword, startDate, endDate);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        applyFilters(saleEvents, searchKeyword, date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        applyFilters(saleEvents, searchKeyword, startDate, date);
    };

    const applyFilters = (events, keyword, start, end) => {
        setLoading(true);
    
        setTimeout(() => {
            let filtered = events;
    
            if (keyword) {
                filtered = filtered.filter(event =>
                    event.sale_events_name.toLowerCase().includes(keyword.toLowerCase())
                );
            }
    
            if (start && end) {
                filtered = filtered.filter(event => {
                    const eventStart = new Date(event.started_at);
                    const eventEnd = new Date(event.ended_at);
                    return (
                        (eventStart >= start && eventStart <= end) ||
                        (eventEnd >= start && eventEnd <= end) ||
                        (eventStart <= start && eventEnd >= end)
                    );
                });
            }
    
            setFilteredEvents(filtered);
            setLoading(false);
        }, 500);
    };
    

    const handleDeleteEvent = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa sự kiện',
            content: 'Bạn có chắc chắn muốn xóa sự kiện này?',
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
                    message.error(error.response.data.message || 'Xóa sự kiện thất bại.');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleOpenSettingModal = (eventId) => {
        setSelectedEventId(eventId);
        setIsSettingModalVisible(true);
    };

    const handleOpenDetailModal = (eventId) => {
        setSelectedEventId(eventId);
        setEventDetailVisible(true);
    };

    const handleOpenEditModal = (eventId) => {
        setSelectedEventId(eventId);
        setIsEditModalVisible(true);
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
            title: 'Trạng thái',
            dataIndex: 'is_actived',
            key: 'is_actived',
            render: (isActive) => isActive ? 'Đang hoạt động' : 'Không hoạt động',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button
                        type="primary"
                        onClick={() => handleOpenSettingModal(record.sale_events_id)}
                        disabled={record.is_actived || new Date(record.ended_at) < new Date()}
                    >
                        Thiết lập
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={() => handleOpenDetailModal(record.sale_events_id)}
                        style={{ marginLeft: '8px' }}
                    >
                        Chi tiết
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={() => handleOpenEditModal(record.sale_events_id)} 
                        style={{ marginLeft: '8px' }}
                        disabled={record.is_actived || new Date(record.ended_at) < new Date()}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button type="primary" danger onClick={() => handleDeleteEvent(record.sale_events_id)} style={{ marginLeft: '8px' }}>Xóa</Button>
                </>
            ),
        }
    ];

    return (
        <div>
            <h1>Sự kiện khuyến mãi</h1>
            <Input
                placeholder="Tìm kiếm sự kiện..."
                value={searchKeyword}
                onChange={handleSearch}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            <DatePicker
                placeholder="Chọn ngày bắt đầu"
                onChange={handleStartDateChange}
                style={{ marginBottom: '20px', marginLeft: '10px' }}
            />
            <DatePicker
                placeholder="Chọn ngày kết thúc"
                onChange={handleEndDateChange}
                style={{ marginBottom: '20px', marginLeft: '10px' }}
            />
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setIsAddModalVisible(true)}
                style={{ float: 'right', marginBottom: '20px' }}
            >
                Tạo sự kiện mới
            </Button>

            <Table
                dataSource={filteredEvents}
                columns={columns}
                loading={loading}
                rowKey="sale_events_id"
                style={{ marginTop: '20px' }}
            />

            <AddSaleEvent
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSuccess={fetchSaleEvents}
            />

            <SaleEventDetail
                eventId={selectedEventId}
                visible={eventDetailVisible}
                onClose={() => {
                    setEventDetailVisible(false);
                    setSelectedEventId(null);
                }}
            />

            <SettingSaleEvent
                eventId={selectedEventId}
                visible={isSettingModalVisible}
                onCancel={() => {
                    setIsSettingModalVisible(false);
                    setSelectedEventId(null);
                }}
                onSetupComplete={fetchSaleEvents}
            />

            <EditSaleEvent
                visible={isEditModalVisible}
                onClose={() => { setIsEditModalVisible(false); setSelectedEventId(null); }}
                eventId={selectedEventId}
                onSuccess={fetchSaleEvents}
            />
        </div>
    );
};

export default SaleEvent;
