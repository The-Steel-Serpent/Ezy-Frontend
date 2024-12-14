import React, { useEffect, useState } from "react";
import { Modal, List, Card, Button, message, Typography } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ShopViolationHistoryModal = ({ visible, onClose, ownerId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      console.log(ownerId);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/history/${ownerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setHistory(data.data);
        })
        .finally(() => setLoading(false));
    }
  }, [visible, ownerId]);

  const handleRevoke = async (historyId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/violations/revoke-account/${historyId}`, {
        method: "put",
      });

      const result = await response.json();
      if (result.success) {
        message.success("Đã thu hồi lịch sử xử lý.");
        setHistory((prev) => prev.filter((item) => item.violation_history_id !== historyId));
      } else {
        message.error(result.message || "Thu hồi thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi thu hồi.");
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={<Title level={4}>Lịch sử xử lý vi phạm</Title>}
      footer={null}
      centered
      width={600}
    >
      {/* {historyData.length > 0 ? (
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
                {history.status !== 'Đã thu hồi' && (
                  <Button
                    danger
                    onClick={() => handleRevoke(history.violation_history_id)}
                    style={{ marginTop: '8px' }}
                  >
                    Thu hồi
                  </Button>
                )}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>Không có lịch sử xử lý nào cho người dùng này.</p>
      )} */}
      <List
        loading={loading}
        dataSource={history}
        renderItem={(item) => (
          <Card>
            <p>
              <b>Ngày cập nhật:</b>{' '}
              {dayjs(item.updatedAt).format('DD/MM/YYYY HH:mm')}
            </p>
            <p>
              <b>Loại xử lý:</b> {item.action_type}
            </p>
            <p>
              <b>Trạng thái:</b> {item.status}
            </p>
            <p>
              <b>Nội dung xử lý:</b> {item.notes || 'Không có'}
            </p>
            <p>
              <b>Người cập nhật:</b> {item.updated_by_username}
            </p>
            {history.status !== 'Đã thu hồi' && (
              <Button
                danger
                onClick={() => handleRevoke(item.violation_history_id)}
                style={{ marginTop: '8px' }}
              >
                Thu hồi
              </Button>
            )}
          </Card>
        )}
      />
    </Modal>
  );
};

export default ShopViolationHistoryModal;
