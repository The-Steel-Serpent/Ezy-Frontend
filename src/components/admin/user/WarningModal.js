import React, { useState } from 'react';
import { Modal, Form, Select, Button, message, Checkbox, Input } from 'antd';
import { useSelector } from "react-redux";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

const { TextArea } = Input;
const { Option } = Select;

const WarningModal = ({ visible, onClose, user }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const adminId = useSelector((state) => state.user.user_id);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [otherNote, setOtherNote] = useState('');

    const noteOptions = [
        "Có dấu hiệu lừa đảo",
        "Đăng tải nội dung/hình ảnh thô tục, phản cảm...",
        "Hủy đơn hàng liên tục hoặc ngay khi người bán đã chuẩn bị hàng",
        "Không nhận hàng nhiều lần",
        "Phát tán tin nhắn/hình ảnh/video có nội dung không lịch sự",
        "Thực hiện giao dịch ngoài Ezy",
        "Vi phạm quyền riêng tư",
        "Người mua yêu cầu trả/hoàn tiền không hợp lý hoặc lạm dụng chính sách hoàn tiền",
        "Người mua cố tình đưa ra đánh giá xấu, gây ảnh hưởng không công bằng đến uy tín người bán",
        "Người mua cố ý quấy rối hoặc đe dọa người bán",
        "Người mua cố ý quấy rối hoặc đe dọa người bán",
        "Người mua gửi tin nhắn không lịch sự hoặc có ngôn từ xúc phạm",
        "Người mua đưa ra thông tin không chính xác để lừa đảo hoặc chiếm đoạt hàng hóa"

    ];

    // Xử lý khi nhấn nút Gửi
    const handleSubmit = async (values) => {
        if (selectedNotes.length === 0 && !isOtherChecked) {
            message.error("Vui lòng chọn ít nhất một nội dung vi phạm.");
            return;
        }

        // Hợp nhất các nội dung checkbox chính và "Khác"
        let notesArray = [...selectedNotes];
        if (isOtherChecked && otherNote.trim()) {
            notesArray.push(otherNote.trim());
        }

        const notes = notesArray.length > 1 ? notesArray.join(', ') : notesArray.join('');

        console.log('Chuỗi notes gửi lên:', notes);

        try {
            setLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/add-violation-history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    violator_id: user.user_id,
                    action_type: values.action_type,
                    notes: notes,
                    currentAdminId: adminId,
                }),
            });

            const result = await response.json();

            if (result.success) {
                message.success('Xử lý vi phạm thành công.');
                if (values.action_type.includes("Khóa")) {
                    const isDisabled = !user.is_banned; 
                    await setDoc(
                        doc(db, 'users', user.user_id),
                        { isDisabled },
                        { merge: true }
                      );
                }
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
                        Gửi
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default WarningModal;
