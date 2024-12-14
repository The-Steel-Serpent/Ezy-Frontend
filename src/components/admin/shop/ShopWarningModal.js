import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message, Checkbox } from "antd";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;

const ShopWarningModal = ({ visible, onClose, shop }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [otherNote, setOtherNote] = useState('');
  const adminId = useSelector((state) => state.user.user_id);


  const noteOptions = [
    "Người bán có đăng sản phẩm cấm",
    "Người bán có đăng sản phẩm giả/nhái",
    "Hủy đơn hàng liên tục hoặc ngay khi người bán đã chuẩn bị hàng",
    "Phát tán tin nhắn/hình ảnh/video có nội dung không lịch sự",
    "Thực hiện giao dịch ngoài Ezy",
    "Vi phạm quyền riêng tư",

  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    if (selectedNotes.length === 0 && !isOtherChecked) {
      message.error("Vui lòng chọn ít nhất một nội dung vi phạm.");
      return;
    }

    let notesArray = [...selectedNotes];
    if (isOtherChecked && otherNote.trim()) {
      notesArray.push(otherNote.trim());
    }

    const notes = notesArray.length > 1 ? notesArray.join(', ') : notesArray.join('');

    console.log('Chuỗi notes gửi lên:', notes);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/add-violation-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          violator_id: shop.user_id,
          action_type: values.action_type,
          notes: notes,
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
            <Option value="Khóa 3 ngày">Khóa 3 ngày</Option>
            <Option value="Khóa 7 ngày">Khóa 7 ngày</Option>
            <Option value="Khóa 14 ngày">Khóa 14 ngày</Option>
            <Option value="Khóa 30 ngày">Khóa 30 ngày</Option>
            <Option value="Khóa vĩnh viễn">Khóa vĩnh viễn</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="notes"
          label="Nội dung vi phạm"
          rules={[{ required: true, message: 'Vui lòng chọn nội dung vi phạm.' }]}
        >
          <Checkbox.Group
            value={selectedNotes}
            onChange={(checkedValues) => {
              setSelectedNotes(checkedValues);
              form.setFieldsValue({ notes: checkedValues });
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '10px',
              }}
            >
              {noteOptions.map(option => (
                <div key={option}>
                  <Checkbox value={option}>{option}</Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>
          <div style={{ marginTop: '10px' }}>
            <Checkbox
              checked={isOtherChecked}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsOtherChecked(checked);
                if (!checked) {
                  setOtherNote('');
                  form.setFieldsValue({ notes: selectedNotes });
                }
              }}
            >
              Khác
            </Checkbox>
            {isOtherChecked && (
              <TextArea
                value={otherNote}
                onChange={(e) => {
                  setOtherNote(e.target.value);
                  form.setFieldsValue({
                    notes: [...selectedNotes, e.target.value].filter(Boolean),
                  });
                }}
                placeholder="Nhập nội dung vi phạm khác"
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ marginTop: '10px' }}
              />
            )}
          </div>
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
