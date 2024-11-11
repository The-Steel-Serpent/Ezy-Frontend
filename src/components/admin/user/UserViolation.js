import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import ViolationList from './ViolationList';

const Violation = () => {
  const [violationsData, setViolationsData] = useState([]);
  const [selectedUserViolations, setSelectedUserViolations] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchViolationsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/violations/get-reported-customers`);
      if (response.data.success) {
        setViolationsData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching violations data:", error);
    }
  };

  useEffect(() => {
    fetchViolationsData();
  }, []);

  const showDetail = (violations) => {
    setSelectedUserViolations(violations);
    setIsModalVisible(true);
  };

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Họ và tên', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số lượng vi phạm', dataIndex: 'violation_count', key: 'violation_count' },
    { title: 'Mức độ cảnh báo', dataIndex: 'warning_level', key: 'warning_level' },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => showDetail(record.violations)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách khách hàng bị báo cáo</h2>
      <Table
        columns={columns}
        dataSource={violationsData}
        rowKey="user_id"
        pagination={{ pageSize: 5 }}
      />
      {isModalVisible && (
        <ViolationList
          violations={selectedUserViolations}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Violation;
