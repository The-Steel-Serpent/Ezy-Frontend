import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import ShopViolationList from './ShopViolationList';
import ShopViolationHistoryModal from './ShopViolationHistoryModal';
import ResolveShopViolationModal from './ResolveShopViolationModal';

const ShopViolation = () => {
  const [shopData, setShopData] = useState([]);
  const [selectedShopViolations, setSelectedShopViolations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isResolveModalVisible, setIsResolveModalVisible] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);

  const fetchShopViolations = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/violations/get-shops-with-violations`);
      if (response.data.success) {
        setShopData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching shop violations data:", error);
    }
  };

  useEffect(() => {
    fetchShopViolations();
  }, []);

  const showDetail = (violations) => {
    setSelectedShopViolations(violations);
    setIsModalVisible(true);
  };

  const openHistoryModal = (ownerId) => {
    setSelectedOwnerId(ownerId);
    setIsHistoryModalVisible(true);
  };

  const openResolveModal = (ownerId) => {
    setSelectedOwnerId(ownerId);
    setIsResolveModalVisible(true);
  };

  const columns = [
    { title: 'Tên cửa hàng', dataIndex: 'shop_name', key: 'shop_name' },
    { title: 'Chủ sở hữu', dataIndex: 'owner_name', key: 'owner_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số lượng vi phạm', dataIndex: 'violation_count', key: 'violation_count' },
    { title: 'Mức độ cảnh báo', dataIndex: 'warning_level', key: 'warning_level' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button onClick={() => showDetail(record.violations)}>
            Chi tiết
          </Button>
          <Button onClick={() => openHistoryModal(record.owner_id)} style={{ marginLeft: '10px' }}>
            Lịch sử xử lý
          </Button>
          <Button onClick={() => openResolveModal(record.owner_id)} style={{ marginLeft: '10px' }} type="primary">
            Xử lý
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20 }}>Danh sách cửa hàng vi phạm</h2>
      <Table
        columns={columns}
        dataSource={shopData}
        rowKey="shop_id"
        pagination={{ pageSize: 5 }}
      />
      <ShopViolationList
        violations={selectedShopViolations}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <ShopViolationHistoryModal
        visible={isHistoryModalVisible}
        onClose={() => setIsHistoryModalVisible(false)}
        userId={selectedOwnerId}
      />
      <ResolveShopViolationModal
        visible={isResolveModalVisible}
        onClose={() => setIsResolveModalVisible(false)}
        ownerId={selectedOwnerId} 
        fetchShopViolations={fetchShopViolations}
      />
    </div>
  );
};

export default ShopViolation;
