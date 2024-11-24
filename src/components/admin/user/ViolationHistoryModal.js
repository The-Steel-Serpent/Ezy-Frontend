import React, { useEffect, useState } from 'react';
import { Modal, List, Card, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const ViolationHistoryModal = ({ visible, onClose, userId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchViolationHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/violations/history/${userId}`);
      if (response.data.success) {
        setHistoryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching violation history:", error);
      message.error('Không thể tải lịch sử vi phạm.');
    } finally {
      setLoading(false);
    }
  };

  const unlockAccount = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/unlock-account/${userId}`);
      if (response.data.success) {
        message.success('Tài khoản đã được mở khóa.');
      } else {
        message.error(response.data.message || 'Không thể mở khóa tài khoản.');
      }
    } catch (error) {
      console.error('Error unlocking account:', error);
      message.error('Đã xảy ra lỗi khi mở khóa tài khoản.');
    }
  };

  const handleRevoke = async (historyId) => {
    try {
      // Revoke violation history by its ID
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/violations/revoke-account/${historyId}`);

      if (response.data.success) {
        message.success(response.data.message);

        // Refresh the history list
        fetchViolationHistory();
      } else {
        message.error(response.data.message || 'Thu hồi thất bại.');
      }
    } catch (error) {
      console.error('Error revoking violation history:', error);
      message.error('Đã xảy ra lỗi khi thu hồi lịch sử vi phạm.');
    }
  };

  useEffect(() => {
    if (visible && userId) {
      fetchViolationHistory();
    }
  }, [visible, userId]);

  return (
    <Modal
      title="Lịch sử xử lý vi phạm"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {historyData.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={historyData}
          loading={loading}
          renderItem={(history) => (
            <List.Item key={history.violation_history_id}>
              <Card>
                <p>
                  <b>Ngày cập nhật:</b>{' '}
                  {dayjs(history.updatedAt).format('DD/MM/YYYY HH:mm')}
                </p>
                <p>
                  <b>Loại xử lý:</b> {history.action_type}
                </p>
                <p>
                  <b>Trạng thái:</b> {history.status}
                </p>
                <p>
                  <b>Nội dung xử lý:</b> {history.notes || 'Không có'}
                </p>
                <p>
                  <b>Người cập nhật:</b> {history.updated_by_username}
                </p>
                <Button
                  danger
                  onClick={() => handleRevoke(history.violation_history_id)}
                  style={{ marginTop: '8px' }}
                >
                  Thu hồi
                </Button>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>Không có lịch sử xử lý nào cho người dùng này.</p>
      )}
    </Modal>
  );
};

export default ViolationHistoryModal;
