import React from "react";
import { Modal, Button, Typography, notification } from "antd";
import axios from "axios";
const { Text } = Typography;

const ResolveShopViolationModal = ({ visible, onClose, violation, refreshShops }) => {
  const handleResolve = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/update-status`,
        { reportId: violation.violation_id }
      );
      if (response.data.success) {
        notification.success({
          message: "Xử lý vi phạm thành công!",
          description: response.data.message,
        });
        onClose();
        refreshShops();
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi xử lý vi phạm",
        description: error.message,
      });
    }
  };

  return (
    <Modal
      title="Chi tiết vi phạm"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="resolve" type="primary" onClick={handleResolve}>
          Xử lý vi phạm
        </Button>,
      ]}
    >
      <Text strong>Loại vi phạm:</Text>
      <p>{violation.violation_type}</p>
      <Text strong>Ghi chú:</Text>
      <p>{violation.notes || "Không có"}</p>
    </Modal>
  );
};

export default ResolveShopViolationModal;
