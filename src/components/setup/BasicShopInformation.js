import { Button, Col, Row, message, Upload, Input, Select, Table, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';

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
    const [district, setDistrict] = useState([]);
    const [ward, setWard] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isRowClicked, setIsRowClicked] = useState(false);

    const handleOK = () => {
        setIsModalVisible(false);
        setIsSubmitted(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

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

    useEffect(() => {
        const URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province';
        const getProvinces = async () => {
            try {
                const res = await axios({
                    method: "GET",
                    url: URL,
                    headers: {
                        'token': `${process.env.REACT_APP_GHV_KEY_TOKEN}`
                    }
                });
                if (res.status === 200) {
                    console.log("Oke em oi", res.data.data);
                    setProvinces(res.data.data);
                }
                else
                    console.log("Error");
            } catch (error) {
                console.log("Error fetch provinces:", error);
            }
        }
        getProvinces();
    }, []);


    const provinceColumns = [
        {
            title: 'ProvinceName',
            dataIndex: 'ProvinceName',
            key: 'ProvinceID',
            
        }
    ];

    const districtColumns = [
        {
            title: 'DistrictName',
            dataIndex: 'DistrictName',
            key: 'DistrictID',

        }
    ];

    const wardColumns = [
        {
            title: 'WardName',
            dataIndex: 'WardName',
            key: 'WardID',
        }
    ];
    return (
        <div>
            <div className='flex justify-between'>
                <h3 className='text-lg font-semibold'>Thông tin cơ bản</h3>
                {!isSellerSetupPath && (
                    <div className='flex gap-2'>
                        <Button>
                            Xem Shop của tôi
                        </Button>
                        <Button>
                            Chỉnh sửa
                        </Button>
                    </div>
                )}

            </div>
            <div className='mt-3 ml-10'>
                <Row gutter={12} className='flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>
                        Tên Shop
                    </Col>
                    <Col span={20}>
                        <Input placeholder='Nhập vào' className='w-72' />
                    </Col>
                </Row>
                <Row gutter={12} className='flex items-center mt-10'>
                    <Col span={4} className='flex justify-end font-semibold'>Logo của Shop</Col>
                    <Col span={20}>
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
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Mô tả Shop</Col>
                    <Col span={20}>boquangdieu2003</Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Họ và tên</Col>
                    <Col span={20}>
                        <Input placeholder='Nhập vào' className='w-72' />
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>CCCD/CMND</Col>
                    <Col span={20}>
                        <Input placeholder='Nhập vào' className='w-72' />
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Địa chỉ</Col>
                    <Col span={20}>
                        <Button
                            onClick={(e) => setIsModalVisible(true)}
                        >+ Thêm</Button>
                    </Col>
                </Row>
            </div>

            <Modal
                title="Thêm địa chỉ mới"
                visible={isModalVisible}
                onOk={handleOK}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button disabled={!isRowClicked} key="confirm" type="primary" onClick={handleOK}>Confirm</Button>

                ]}
            >
                <div className='flex h-72 overflow-hidden'>
                    <Table
                        columns={provinceColumns}
                        dataSource={provinces}
                        pagination={false}
                        rowKey="province_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'

                    />
                    <Table
                        // columns={subCategoryColumns}
                        // dataSource={subCategories}
                        pagination={false}
                        rowKey="sub_category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'

                    />
                    <Table
                        // columns={subCategoryColumns}
                        // dataSource={subCategories}
                        pagination={false}
                        rowKey="sub_category_id"
                        showHeader={false}
                        className='w-[50%] overflow-y-auto custom-scrollbar'

                    />
                </div>
                {/* <div className='mt-4'>
                    <p>Đã chọn: {selectedCategoryPath}</p>
                </div> */}
            </Modal>
        </div>
    )
}

export default BasicShopInformation