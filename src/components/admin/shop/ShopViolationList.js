import React from 'react';
import { Modal, List } from 'antd';

const ShopViolationList = ({ violations, visible, onClose }) => {
  return (
    <Modal
      title="Chi tiết các vi phạm của cửa hàng"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <List
        dataSource={violations}
        renderItem={(violation) => (
          <List.Item key={violation.violation_id}>
            <List.Item.Meta
              title={`Loại vi phạm: ${violation.violation_type}`}
              description={`
                Mức độ: ${violation.priority_level} | 
                Ngày báo cáo: ${violation.date_reported} | 
                Trạng thái: ${violation.status} | 
                Ghi chú: ${violation.notes || "Không có"}
              `}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ShopViolationList;
