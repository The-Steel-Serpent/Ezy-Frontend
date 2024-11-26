import React, { useEffect, useState } from "react";
import { Modal, List, Card, Button, message, Typography } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ShopViolationHistoryModal = ({ visible, onClose, shopId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/history/${shopId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setHistory(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [visible, shopId]);

  const handleRevoke = async (historyId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/revoke/${historyId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        message.success("Đã thu hồi lịch sử xử lý.");
        setHistory((prev) => prev.filter((item) => item.violation_history_id !== historyId));
      } else {
        message.error(result.message || "Thu hồi thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thu hồi.");
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={<Title level={4}>Lịch sử xử lý vi phạm</Title>}
      footer={null}
      centered
      width={600}
    >
      <List
        loading={loading}
        dataSource={history}
        renderItem={(item) => (
          <Card>
            <Text strong>Ngày xử lý:</Text>
            <Text style={{ marginLeft: "8px" }}>
              {dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
            </Text>
            <Text strong>Ghi chú:</Text>
            <Text style={{ marginLeft: "8px" }}>{item.notes || "Không có"}</Text>
            <Button danger onClick={() => handleRevoke(item.violation_history_id)}>
              Thu hồi
            </Button>
          </Card>
        )}
      />
    </Modal>
  );
};

export default ShopViolationHistoryModal;
