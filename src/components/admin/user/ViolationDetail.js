import React, { useState } from "react";
import { Modal, Checkbox, Button, Image, message, Typography, Divider } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ViolationDetail = ({ violation, onClose, onViewed, isViewedTab }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleMarkAsViewed = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/mark-as-viewed`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: violation.violation_id }),
      });

      const result = await response.json();

      if (result.success) {
        message.success("Đã xác nhận báo cáo.");
        onViewed();
        onClose();
      } else {
        message.error(result.message || "Xác nhận thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  return (
    <Modal
      visible
      onCancel={onClose}
      title={<Title level={4} style={{ margin: 0, textAlign: "center" }}>Chi tiết báo cáo</Title>}
      footer={null}
      centered
      width={600}
    >
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <Text strong>Loại báo cáo:</Text>
          <Text style={{ marginLeft: "8px" }}>{violation.violation_type}</Text>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Text strong>Ghi chú:</Text>
          <Text style={{ marginLeft: "8px" }}>{violation.notes}</Text>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Text strong>Ngày báo cáo:</Text>
          <Text style={{ marginLeft: "8px" }}>
            {violation.date_reported
              ? dayjs(violation.date_reported).format("DD/MM/YYYY HH:mm:ss")
              : "N/A"}
          </Text>
        </div>
        <Divider />
        <div>
          <Text strong>Hình ảnh liên quan:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "16px",
              justifyContent: "center",
            }}
          >
            {violation.imgs.length > 0 ? (
              violation.imgs.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  width={120}
                  height={120}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              ))
            ) : (
              <Text>Không có hình ảnh.</Text>
            )}
          </div>
        </div>
        {!isViewedTab && (
          <div style={{ marginTop: "24px" }}>
            {/* <Checkbox onChange={(e) => setIsChecked(e.target.checked)} style={{ marginBottom: "16px" }}>
              <Text>Xác nhận đã xem báo cáo này</Text>
            </Checkbox>
            <Button
              type="primary"
              disabled={!isChecked}
              onClick={handleMarkAsViewed}
              block
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                height: "40px",
              }}
            >
              Xác nhận
            </Button> */}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViolationDetail;
