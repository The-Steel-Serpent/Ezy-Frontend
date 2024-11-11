import React, { useState } from 'react';
import { Modal, List, Button } from 'antd';
import dayjs from 'dayjs';

const ShopViolationList = ({ violations, visible, onClose }) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const showImages = (imgs) => {
    setSelectedImages(imgs);
    setImageModalVisible(true);
  };

  return (
    <>
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
                  Ngày báo cáo: ${dayjs(violation.date_reported).format('DD/MM/YYYY HH:mm')} | 
                  Trạng thái: ${violation.status} | 
                  Ghi chú: ${violation.notes || "Không có"}
                `}
              />
              {violation.imgs && violation.imgs.length > 0 && (
                <Button onClick={() => showImages(violation.imgs)}>Xem ảnh</Button>
              )}
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal hiển thị ảnh với kích thước gốc */}
      <Modal
        title="Ảnh vi phạm"
        visible={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={null}
      >
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {selectedImages.map((imgUrl, index) => (
            <img
              key={index}
              src={imgUrl}
              alt={`Violation Image ${index + 1}`}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '5px' }}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ShopViolationList;
