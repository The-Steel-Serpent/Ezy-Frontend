import React, { useEffect, useState } from 'react';
import { Table, message, Button, Popconfirm } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddFlashSale from './AddFlashSale'; // Import modal thêm Flash Sale
import EditFlashSale from './EditFlashSale'; // Import modal chỉnh sửa Flash Sale

const FlashSale = () => {
  const [data, setData] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentFlashSale, setCurrentFlashSale] = useState(null); // Dữ liệu Flash Sale đang chỉnh sửa

  // Cấu hình các cột cho bảng
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
      title: 'Thời gian bắt đầu',
      dataIndex: 'started_at',
      key: 'started_at',
      render: (text) => dayjs(text).format('HH:mm:ss DD/MM/YYYY'), // Hiển thị theo giờ địa phương
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'ended_at',
      key: 'ended_at',
      render: (text) => dayjs(text).format('HH:mm:ss DD/MM/YYYY'), // Hiển thị theo giờ địa phương
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
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa Flash Sale này?"
            onConfirm={() => handleDeleteFlashSale(record.flash_sales_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} type="danger">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Hàm gọi API để lấy danh sách Flash Sale
  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/get-all`);
      if (response.data.success) {
        setData(response.data.data);
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
  }, []);

  // Hàm hiển thị modal thêm Flash Sale
  const showAddFlashSaleModal = () => {
    setIsAddModalVisible(true);
  };

  // Hàm hiển thị modal chỉnh sửa Flash Sale
  const showEditFlashSaleModal = (flashSale) => {
    setCurrentFlashSale(flashSale);
    setIsEditModalVisible(true);
  };

  // Hàm đóng modal thêm Flash Sale
  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
  };

  // Hàm đóng modal chỉnh sửa Flash Sale
  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setCurrentFlashSale(null); // Reset dữ liệu chỉnh sửa
  };

  // Hàm gọi lại API sau khi thêm Flash Sale thành công
  const handleAddSuccess = () => {
    fetchData();
    handleAddModalClose(); // Đóng modal thêm
  };

  const handleEditSuccess = () => {
    fetchData();
    handleEditModalClose(); // Đóng modal chỉnh sửa
  };

  // Hàm xóa Flash Sale
  const handleDeleteFlashSale = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/flash-sales/delete/${id}`);
      if (response.data.success) {
        message.success('Xóa Flash Sale thành công');
        fetchData(); // Làm mới danh sách sau khi xóa
      } else {
        message.error('Xóa Flash Sale thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi xóa Flash Sale');
      console.error('Lỗi khi gọi API', error);
    }
  };

  return (
    <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={showAddFlashSaleModal} // Gọi modal khi bấm nút
      >
        Thêm Flash Sale
      </Button>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="flash_sales_id"
      />

      <AddFlashSale 
        visible={isAddModalVisible}
        onClose={handleAddModalClose}
        onAddSuccess={handleAddSuccess}
      />

      <EditFlashSale 
        visible={isEditModalVisible}
        onClose={handleEditModalClose}
        onEditSuccess={handleEditSuccess} 
        flashSaleData={currentFlashSale}
      />
    </div>
  );
};

export default FlashSale;
