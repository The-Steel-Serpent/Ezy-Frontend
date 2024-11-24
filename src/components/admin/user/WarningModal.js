import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Option } = Select;

const WarningModal = ({ visible, onClose, user }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const adminId = useSelector((state) => state.user.user_id);


    const handleSubmit = async (values) => {
        console.log("Payload being sent:", {
            violator_id: user.user_id,
            action_type: values.action_type,
            notes: values.notes,
            currentAdminId: adminId,
        });

        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/add-violation-history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    violator_id: user.user_id,
                    action_type: values.action_type,
                    notes: values.notes,
                    currentAdminId: adminId,
                }),
            });

            const result = await response.json();

            if (result.success) {
                message.success('Xử lý vi phạm thành công.');
                onClose();
            } else {
                message.error(result.message || 'Xử lý vi phạm thất bại.');
            }
        } catch (error) {
            console.error('Error handling violation:', error);
            message.error('Đã xảy ra lỗi khi xử lý vi phạm.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            title={`Xử lý vi phạm cho ${user?.full_name}`}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="action_type"
                    label="Hình thức xử lý"
                    rules={[{ required: true, message: 'Vui lòng chọn hình thức xử lý.' }]}
                >
                    <Select placeholder="Chọn hình thức xử lý">
                        <Option value="Cảnh cáo">Cảnh cáo</Option>
                        <Option value="Khóa 3 ngày">Khóa 3 ngày</Option>
                        <Option value="Khóa 7 ngày">Khóa 7 ngày</Option>
                        <Option value="Khóa 30 ngày">Khóa 30 ngày</Option>
                        <Option value="Cấm vĩnh viễn">Cấm vĩnh viễn</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="notes"
                    label="Nội dung vi phạm"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung vi phạm.' }]}
                >
                    <TextArea rows={4} placeholder="Nhập nội dung vi phạm" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Gửi
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default WarningModal;
