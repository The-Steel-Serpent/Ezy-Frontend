import React, { useState } from 'react';
import { Modal, Select, Input, Button, notification } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ResolveViolationModal = ({ visible, onClose, userId, fetchViolationsData }) => {
  const [actionType, setActionType] = useState(null);
  const [notes, setNotes] = useState('');

  const handleResolve = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/violations/handle-resolution`, {
        userId,
        action_type: actionType,
        notes,
        updated_by_id: 'admin123' 
      });
      notification.success({
        message: 'Xử lý thành công',
        description: `Vi phạm của người dùng ID ${userId} đã được xử lý.`,
      });
      fetchViolationsData();
      onClose();
      setActionType(null);
      setNotes('');
    } catch (error) {
      console.error("Error resolving violation:", error);
      notification.error({
        message: 'Xử lý thất bại',
        description: 'Đã xảy ra lỗi khi xử lý vi phạm.',
      });
    }
  };

  return (
    <Modal
      title="Xử lý vi phạm"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="resolve" type="primary" onClick={handleResolve} disabled={!actionType}>
          Xử lý
        </Button>,
      ]}
    >
      <div style={{ marginBottom: '16px' }}>
        <label>Loại xử lý:</label>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn loại xử lý"
          value={actionType}
          onChange={setActionType}
        >
          <Option value="Cảnh cáo">Cảnh cáo</Option>
          <Option value="Khóa 3 ngày">Khóa 3 ngày</Option>
          <Option value="Khóa 7 ngày">Khóa 7 ngày</Option>
          <Option value="Khóa 30 ngày">Khóa 30 ngày</Option>
          <Option value="Khóa vĩnh viễn">Khóa vĩnh viễn</Option>
        </Select>
      </div>
      <div>
        <label>Ghi chú xử lý:</label>
        <Input.TextArea
          rows={4}
          placeholder="Nhập ghi chú về xử lý vi phạm..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default ResolveViolationModal;
