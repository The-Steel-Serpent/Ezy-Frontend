import React from "react";
import { Modal, Button, Typography, Space, notification } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
const { Text } = Typography;

const ResolveViolationModal = ({
  visible,
  onClose,
  report,
  onApprove,
}) => {
  const adminId = useSelector((state) => state.user.user_id); 
  if (!report) return null;

  const handleApprove = async () => {
    try {
      const response = await onApprove(adminId);
      if (response.success) {
        notification.success({
          message: "Duyệt báo cáo thành công!",
          description: `Quyết định xử phạt: ${response.result.penalty}`,
        });
        onClose();
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi duyệt báo cáo!",
        description: error.message,
      });
    }
  };

  return (
    <Modal
      title="Chi tiết báo cáo"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="approve" type="primary" onClick={handleApprove}>
          Duyệt báo cáo
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle">
        <Text strong>Loại vi phạm:</Text>
        <Text>{report.violation_type}</Text>
        <Text strong>Id người gửi:</Text>
        <Text>{report.sender_id}</Text>
        <Text strong>Ngày báo cáo:</Text>
        <Text>{dayjs(report.date_reported).format("DD/MM/YYYY HH:mm:ss")}</Text>

        <Text strong>Ghi chú:</Text>
        <Text>{report.notes || "Không có"}</Text>

        {report.imgs && report.imgs.length > 0 && (
          <Space direction="vertical" size="middle">
            <Text strong>Hình ảnh:</Text>
            <Space
              size="small"
              wrap
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {report.imgs.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hình ảnh ${index + 1}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </Space>
          </Space>
        )}
      </Space>
    </Modal>
  );
};

export default ResolveViolationModal;
