import React, { useEffect, useState } from 'react';
import { Modal, List } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const ViolationHistoryModal = ({ visible, onClose, userId }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchViolationHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/violations/history/${userId}`);
        if (response.data.success) {
          setHistoryData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching violation history:", error);
      }
    };

    if (visible && userId) {
      fetchViolationHistory();
    }
  }, [visible, userId]);

  return (
    <Modal
      title="Lịch sử xử lý vi phạm"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        dataSource={historyData}
        renderItem={(history) => (
          <List.Item key={history.violation_history_id}>
            <List.Item.Meta
              title={`Ngày cập nhật: ${dayjs(history.updatedAt).format('DD/MM/YYYY HH:mm')}`}
              description={`Loại xử lý: ${history.action_type} | Trạng thái: ${history.status} | Ghi chú: ${history.notes || "Không có"} | Người cập nhật: ${history.updated_by_username}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ViolationHistoryModal;
