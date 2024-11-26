import React, { useState } from "react";
import { Modal, Typography, Image, Checkbox, Button, message, Divider } from "antd";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const ShopViolationDetail = ({ violation, onClose, isViewedTab }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleMarkAsViewed = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/violations/mark-as-viewed`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId: violation.violation_id }),
        }
      );

      const result = await response.json();
      if (result.success) {
        message.success("Đã đánh dấu vi phạm là đã xem.");
        onClose();
      } else {
        message.error(result.message || "Không thể cập nhật trạng thái.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi đánh dấu vi phạm.");
    }
  };

  return (
    <Modal
      visible
      onCancel={onClose}
      title={<Title level={4} style={{ textAlign: "center" }}>Chi tiết báo cáo</Title>}
      footer={null}
      centered
      width={700}
      bodyStyle={{ padding: "20px 30px" }}
    >
      <div>
        <Paragraph>
          <Text strong style={{ fontSize: "14px", color: "#595959" }}>Mã vi phạm:</Text>{" "}
          <Text>{violation.violation_id}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong style={{ fontSize: "14px", color: "#595959" }}>Loại vi phạm:</Text>{" "}
          <Text>{violation.violation_type}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong style={{ fontSize: "14px", color: "#595959" }}>Ghi chú:</Text>{" "}
          <Text>{violation.notes || "Không có"}</Text>
        </Paragraph>
        <Paragraph>
          <Text strong style={{ fontSize: "14px", color: "#595959" }}>Ngày báo cáo:</Text>{" "}
          <Text>
            {violation.date_reported
              ? dayjs(violation.date_reported).format("DD/MM/YYYY HH:mm:ss")
              : "N/A"}
          </Text>
        </Paragraph>
        <Divider />
        <div>
          <Text strong style={{ fontSize: "14px", color: "#595959" }}>Hình ảnh liên quan:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              marginTop: "16px",
              justifyContent: "center",
            }}
          >
            {violation.imgs.length > 0 ? (
              violation.imgs.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  width={140}
                  height={140}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #d9d9d9",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                />
              ))
            ) : (
              <Text style={{ color: "#8c8c8c" }}>Không có hình ảnh.</Text>
            )}
          </div>
        </div>
        {!isViewedTab && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Checkbox
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{
                marginBottom: "16px",
                fontSize: "14px",
                color: "#595959",
              }}
            >
              Xác nhận đã xem báo cáo này
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
                fontSize: "16px",
              }}
            >
              Xác nhận
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ShopViolationDetail;
