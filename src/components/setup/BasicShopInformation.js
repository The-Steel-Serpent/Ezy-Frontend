import { Button, Col, Row, Flex, message, Upload } from 'antd';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const BasicShopInformation = () => {
    const location = useLocation();
    const isSellerSetupPath = location.pathname === '/seller/seller-setup';
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    return (
        <div>
            <div className='flex justify-between'>
                <h3 className='text-lg font-semibold'>Thông tin cơ bản</h3>
                <div className='flex gap-2'>
                    <Button>
                        Xem Shop của tôi
                    </Button>
                    <Button>
                        Chỉnh sửa
                    </Button>
                </div>
            </div>
            <div className='mt-8 ml-10'>
                <Row gutter={12}>
                    <Col span={3} className='flex justify-end font-semibold'>Tên Shop</Col>
                    <Col span={21}>boquangdieu2003</Col>
                </Row>
                <Row gutter={12} className='flex items-center mt-10'>
                    <Col span={3} className='flex justify-end font-semibold'>Logo của Shop</Col>
                    <Col span={21}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="avatar"
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10'>
                    <Col span={3} className='flex justify-end font-semibold'>Mô tả Shop</Col>
                    <Col span={21}>boquangdieu2003</Col>
                </Row>
            </div>
        </div>
    )
}

export default BasicShopInformation