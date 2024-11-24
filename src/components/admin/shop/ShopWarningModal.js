import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;

const ShopWarningModal = ({ visible, onClose, shop }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const adminId = useSelector((state) => state.user.user_id);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/add-violation-history`, { // Sửa endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          violator_id: shop.user_id, 
          action_type: values.action_type,
          notes: values.notes,
          currentAdminId: adminId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        message.success("Cảnh báo đã được gửi.");
        onClose();
      } else {
        message.error(result.message || "Gửi cảnh báo thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi gửi cảnh báo.");
      console.error("Error sending warning:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onCancel={onClose} title="Cảnh báo vi phạm" footer={null}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Hình thức xử lý"
          name="action_type"
          rules={[{ required: true, message: "Vui lòng chọn hình thức xử lý." }]}
        >
          <Select placeholder="Chọn hình thức">
            <Option value="Cảnh cáo">Cảnh cáo</Option>
            <Option value="Khóa 3 ngày">Đình chỉ 3 ngày</Option>
            <Option value="Khóa 7 ngày">Đình chỉ 7 ngày</Option>
            <Option value="Khóa 14 ngày">Đình chỉ 14 ngày</Option>
            <Option value="Khóa 30 ngày">Đình chỉ 30 ngày</Option>
            <Option value="Cấm vĩnh viễn">Khóa cửa hàng</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          name="notes"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú." }]}
        >
          <TextArea rows={4} placeholder="Nhập ghi chú" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Gửi cảnh báo
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShopWarningModal;
