import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const ShopOwnerDetail = ({ owner, onClose }) => {
    return (
        <Modal
            title="Chi tiết chủ cửa hàng"
            visible={!!owner}
            onCancel={onClose}
            footer={<Button onClick={onClose}>Đóng</Button>}
        >
            <Form layout="vertical">
                <Form.Item label="Họ và tên">
                    <Input value={owner.full_name} readOnly />
                </Form.Item>
                <Form.Item label="Email">
                    <Input value={owner.email} readOnly />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                    <Input value={owner.phone_number} readOnly />
                </Form.Item>
                <Form.Item label="Giới tính">
                    <Input value={owner.gender || "Không có"} readOnly />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ShopOwnerDetail;
