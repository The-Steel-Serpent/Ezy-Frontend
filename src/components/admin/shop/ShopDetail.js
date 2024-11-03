import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import ShopOwnerDetail from './ShopOwnerDetail';

const ShopDetail = ({ shop, onClose }) => {
    const [showOwnerDetails, setShowOwnerDetails] = useState(false);

    return (
        <Modal
            title="Chi tiết cửa hàng"
            visible={!!shop}
            onCancel={onClose}
            footer={<Button onClick={onClose}>Đóng</Button>}
        >
            <Form layout="vertical">
                <Form.Item label="Tên cửa hàng">
                    <Input value={shop.shop_name} readOnly />
                </Form.Item>
                <Form.Item label="Mô tả">
                    <Input.TextArea value={shop.shop_description} readOnly />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                    <Input value={shop.shop_address} readOnly />
                </Form.Item>
                <Form.Item label="Email">
                    <Input value={shop.business_email} readOnly />
                </Form.Item>

                <Button onClick={() => setShowOwnerDetails(true)}>
                    Xem chi tiết chủ cửa hàng
                </Button>
            </Form>

            {showOwnerDetails && (
                <ShopOwnerDetail
                    owner={shop.UserAccount}
                    onClose={() => setShowOwnerDetails(false)}
                />
            )}
        </Modal>
    );
};

export default ShopDetail;
