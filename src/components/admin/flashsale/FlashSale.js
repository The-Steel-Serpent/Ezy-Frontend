import React, { useEffect, useState } from 'react';
import { Table, message, Button, Popconfirm, DatePicker } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddFlashSale from './AddFlashSale';
import EditFlashSale from './EditFlashSale';
import ManageTimeFrames from './ManageTimeFrames';
import io from 'socket.io-client';
import RegisteredProducts from './RegisteredProducts';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const socket = io(process.env.REACT_APP_BACKEND_URL);

const FlashSale = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isTimeFramesModalVisible, setIsTimeFramesModalVisible] = useState(false);
  const [isRegisteredProductsVisible, setIsRegisteredProductsVisible] = useState(false);
  const [currentFlashSale, setCurrentFlashSale] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'flash_sales_id',
      key: 'flash_sales_id',
    },
    {
      title: 'Tên Flash Sale',
      dataIndex: 'flash_sales_name',
      key: 'flash_sales_name',
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail) => thumbnail ? <img src={thumbnail} alt="Thumbnail" style={{ width: 100 }} /> : 'Không có ảnh',
    },
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
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditFlashSaleModal(record)}
            style={{ marginRight: 8 }}
          >
            Chỉnh sửa
          </Button>
          <Button onClick={() => showTimeFramesModal(record)} style={{ marginRight: 8 }}>
            Quản lý khung giờ
          </Button>
          <Button onClick={() => showRegisteredProductsModal(record.flash_sales_id)} style={{ marginRight: 8 }}>
            Sản phẩm đăng ký
          </Button>
          <Popconfirm

            title="Bạn có chắc chắn muốn xóa Flash Sale này?"
            onConfirm={() => handleDeleteFlashSale(record.flash_sales_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ backgroundColor: 'red', color: 'white', borderColor: 'red', marginTop: '8px' }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/get-all`);
      if (response.data.success) {
        setData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        message.error('Không thể tải dữ liệu flash sale');
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu flash sale');
      console.error('Lỗi khi gọi API', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Lắng nghe sự kiện bắt đầu và kết thúc khung giờ flash sale
    socket.on('flashSaleTimeFrameStarted', (data) => {
      message.info(`Flash sale ${data.timeFrameId} đã bắt đầu!`);
      fetchData();
    });

    socket.on('flashSaleTimeFrameEnded', (data) => {
      message.warning(`Flash sale ${data.timeFrameId} đã kết thúc.`);
      fetchData();
    });

    // Lắng nghe sự kiện bắt đầu và kết thúc flash sale
    socket.on('flashSaleStarted', (data) => {
      message.info(`Flash sale ${data.flashSaleId} đã bắt đầu!`);
      fetchData();
    });

    socket.on('flashSaleEnded', (data) => {
      message.warning(`Flash sale ${data.flashSaleId} đã kết thúc.`);
      fetchData();
    });

    return () => {
      socket.off('flashSaleTimeFrameStarted');
      socket.off('flashSaleTimeFrameEnded');
      socket.off('flashSaleStarted');
      socket.off('flashSaleEnded');
    };
  }, []);

  const showAddFlashSaleModal = () => {
    setIsAddModalVisible(true);
  };

  const showEditFlashSaleModal = (flashSale) => {
    setCurrentFlashSale(flashSale);
    setIsEditModalVisible(true);
  };

  const showTimeFramesModal = (flashSale) => {
    setCurrentFlashSale(flashSale);
    setIsTimeFramesModalVisible(true);
  };

  const showRegisteredProductsModal = (flashSaleId) => {
    console.log("Selected Flash Sale ID:", flashSaleId); // Add this line to verify ID
    setCurrentFlashSale(flashSaleId); // Ensure this is an ID, not an object
    setIsRegisteredProductsVisible(true);
  };


  const handleDeleteFlashSale = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/delete/${id}`);
      if (response.data.success) {
        message.success('Xóa Flash Sale thành công');
        fetchData();
      } else {
        message.error('Xóa Flash Sale thất bại');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      console.error('Lỗi khi gọi API', error);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = data.filter((item) => {
        const startedAt = dayjs(item.started_at);
        const endedAt = dayjs(item.ended_at);

        return (
          (startedAt.isSameOrAfter(startDate, 'day') && startedAt.isSameOrBefore(endDate, 'day')) ||
          (endedAt.isSameOrAfter(startDate, 'day') && endedAt.isSameOrBefore(endDate, 'day')) ||
          (startedAt.isBefore(startDate, 'day') && endedAt.isAfter(endDate, 'day'))
        );
      });
      setFilteredData(filtered);
    } else {
      message.warning('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
    }
  };

  return (
    <div>
      <div className="text-center">
        <h3 className="text-3xl font-bold text-blue-600">Quản lý Flash Sale</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <DatePicker placeholder="Ngày bắt đầu" onChange={(date) => setStartDate(date ? dayjs(date) : null)} />
          <DatePicker placeholder="Ngày kết thúc" onChange={(date) => setEndDate(date ? dayjs(date) : null)} />
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddFlashSaleModal}
        >
          Thêm Flash Sale
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="flash_sales_id"
      />

      <AddFlashSale
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={() => fetchData()}
      />

      <EditFlashSale
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onEditSuccess={() => fetchData()}
        flashSaleData={currentFlashSale}
      />

      <ManageTimeFrames
        visible={isTimeFramesModalVisible}
        onClose={() => setIsTimeFramesModalVisible(false)}
        flashSaleId={currentFlashSale?.flash_sales_id}
        flashSaleStart={currentFlashSale?.started_at}
        flashSaleEnd={currentFlashSale?.ended_at}
      />

      <RegisteredProducts
        visible={isRegisteredProductsVisible}
        onClose={() => setIsRegisteredProductsVisible(false)}
        flashSaleId={currentFlashSale}
      />

    </div>
  );
};

export default FlashSale;
