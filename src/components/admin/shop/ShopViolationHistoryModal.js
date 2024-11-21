import React, { useEffect, useState } from "react";
import { Modal, List } from "antd";
import axios from "axios";

const ShopViolationHistoryModal = ({ shopId, visible, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/violations/history/${shopId}`
        );
        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    if (visible) {
      fetchHistory();
    }
  }, [visible, shopId]);

  return (
    <Modal
      title="Lịch sử vi phạm"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        dataSource={history}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`Ngày xử lý: ${item.updatedAt}`}
              description={`Loại xử lý: ${item.action_type} | Ghi chú: ${item.notes}`}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ShopViolationHistoryModal;
