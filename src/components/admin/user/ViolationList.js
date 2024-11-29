import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Table, Button, message } from 'antd';
import dayjs from 'dayjs';
import ViolationDetail from './ViolationDetail';

const { TabPane } = Tabs;

const ViolationList = ({ user, onClose }) => {
  const [violations, setViolations] = useState([]);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [activeTab, setActiveTab] = useState('unviewed');

  const fetchViolations = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/user/${user.user_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setViolations(data.data);
      });
  };
  const handleMarkAsViewed = async (violationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/mark-as-viewed`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: violationId }),
      });

      const result = await response.json();

      if (result.success) {
        // Cập nhật danh sách sau khi đánh dấu là đã xem
        fetchViolations();
      } else {
        message.error(result.message || "Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  const handleViewDetail = (record) => {
    // Cập nhật trạng thái vi phạm thành "Đã xem"
    handleMarkAsViewed(record.violation_id);
    // Hiển thị chi tiết
    setSelectedViolation(record);
  };

  useEffect(() => {
    fetchViolations();
  }, [user]);

  const renderViolations = (status) =>
    violations.filter((v) => v.status === status);

  const columns = [
    { title: 'Mã vi phạm', dataIndex: 'violation_id', key: 'violation_id' },
    { title: 'Loại vi phạm', dataIndex: 'violation_type', key: 'violation_type' },
    {
      title: 'Ngày gửi',
      dataIndex: 'date_reported',
      key: 'date_reported',
      render: (text) =>
        text ? dayjs(text).format('DD/MM/YYYY HH:mm:ss') : 'N/A', // Format date
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => handleViewDetail(record)}>Xem thông tin</Button>
      ),
    },
  ];

  return (
    <Modal visible onCancel={onClose} title={`Báo cáo của ${user.full_name}`} footer={null}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Chưa xem" key="unviewed">
          <Table
            dataSource={renderViolations('Chưa xử lý')}
            columns={columns}
            rowKey="violation_id"
          />
        </TabPane>
        <TabPane tab="Đã xem" key="viewed">
          <Table
            dataSource={renderViolations('Đã xem')}
            columns={columns}
            rowKey="violation_id"
          />
        </TabPane>
      </Tabs>
      {selectedViolation && (
        <ViolationDetail
          violation={selectedViolation}
          onClose={() => setSelectedViolation(null)}
          onViewed={fetchViolations}
          isViewedTab={activeTab === 'viewed'}
        />
      )}
    </Modal>
  );
};

export default ViolationList;
