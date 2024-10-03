import { Button, Col, Row, message, Upload, Input, Select, Table, Modal } from 'antd';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom';
import {  PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

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

const initialState = {
    loading: false,
    imageUrl: [],
    district: [],
    ward: [],
    provinces: [],
    isModalVisible: false,
    isSubmitted: false,
    provinceSelected: null,
    districtSelected: null,
    wardSelected: null,
    enableConfirm: true,
    detailAddress: null,
    shop_name: '',
    shop_description: '',
    full_name: '',
    cccd: '',
    touch: {
        shop_name: false,
        shop_description: false,
        full_name: false,
        cccd: false
    },
    errors: {
        shop_name: '',
        shop_description: '',
        full_name: '',
        cccd: ''
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_IMAGE_URL':
            return { ...state, imageUrl: action.payload };
        case 'SET_DISTRICTS':
            return { ...state, district: action.payload };
        case 'SET_WARDS':
            return { ...state, ward: action.payload };
        case 'SET_PROVINCES':
            return { ...state, provinces: action.payload };
        case 'SET_SUBMITTED':
            return { ...state, isSubmitted: action.payload };
        case 'SET_SELECTED_PROVINCE':
            return { ...state, provinceSelected: action.payload };
        case 'SET_SELECTED_DISTRICT':
            return { ...state, districtSelected: action.payload };
        case 'SET_SELECTED_WARD':
            return { ...state, wardSelected: action.payload };
        case 'SET_ENABLE_CONFIRM':
            return { ...state, enableConfirm: action.payload };
        case 'SET_DETAIL_ADDRESS':
            return { ...state, detailAddress: action.payload };
        case 'SET_SHOP_NAME':
            return { ...state, shop_name: action.payload };
        case 'SET_SHOP_DESCRIPTION':
            return { ...state, shop_description: action.payload };
        case 'SET_FULL_NAME':
            return { ...state, full_name: action.payload };
        case 'SET_CCCD':
            return { ...state, cccd: action.payload };
        case 'SET_TOUCHED':
            return {
                ...state,
                touch: {
                    ...state.touch,
                    [action.payload]: true
                }
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.payload
            };
        default:
            return state;
    }
};


const BasicShopInformation = ({ onData }) => {
    const location = useLocation();
    const isSellerSetupPath = location.pathname === '/seller/seller-setup';
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleConfirm = () => {
        setIsModalVisible(false);
        dispatch({ type: 'SET_SUBMITTED', payload: true });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = ({ fileList: newList }) => {
        if(newList.length > 1) {
            newList.shift();
        }
            dispatch({ type: 'SET_IMAGE_URL', payload: newList });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
        dispatch({ type: 'SET_TOUCHED', payload: name });
    };

    const validate = () => {
        let valid = true;
        let newErrors = { shop_name: '', shop_description: '', full_name: '', cccd: '' };
        // Validate shop name
        if (!state.shop_name.trim()) {
            newErrors.shop_name = 'Tên shop không được để trống';
            valid = false;
        } else if (state.shop_name.length < 6) {
            newErrors.shop_name = 'Tên shop phải có ít nhất 6 ký tự';
            valid = false;
        }

        // Validate shop description
        if (!state.shop_description.trim()) {
            newErrors.shop_description = 'Mô tả shop không được để trống';
            valid = false;
        } else if (state.shop_description.length < 10) {
            newErrors.shop_description = 'Mô tả shop phải có ít nhất 10 ký tự';
            valid = false;
        }

        // Validate full name
        if (!state.full_name.trim()) {
            newErrors.full_name = 'Họ và tên không được để trống';
            valid = false;
        }
        // Validate cccd
        if (!state.cccd.trim()) {
            newErrors.cccd = 'CCCD/CMND không được để trống';
            valid = false;
        } else if (state.cccd.length !== 10) {
            newErrors.cccd = 'CCCD/CMND phải có đúng 10 số';
            valid = false;
        } else if (isNaN(state.cccd)) {
            newErrors.cccd = 'CCCD/CMND phải là số';
            valid = false;
        }
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return valid;
    };
    // validate input and pass data to parent component
    useEffect(() => {
        onData({ noErrorBasicInfo: false });
        console.log("Truc oiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii:", state);
        const check =  validate();
        if (check && state.provinceSelected && state.districtSelected && state.wardSelected && state.imageUrl.length > 0 
            && state.detailAddress) {
            const data = {
                shop_name: state.shop_name,
                shop_description: state.shop_description,
                full_name: state.full_name,
                cccd: state.cccd,
                imageUrl: state.imageUrl,
                address: {
                    province: state.provinceSelected,
                    district: state.districtSelected,
                    ward: state.wardSelected,
                    detail: state.detailAddress
                },
                noErrorBasicInfo: true
            };
            onData(data);
        }
        else {
            onData({ noErrorBasicInfo: false });
        }
    }, [state.shop_name, state.shop_description, state.full_name, state.cccd, state.provinces, state.district, state.ward, state.detailAddress, state.imageUrl]);


    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {<PlusOutlined />}
            <div className='mt-2'>
                Upload
            </div>
        </button>
    );

    const handleProvinceClick = (record) => {
        dispatch({ type: 'SET_SELECTED_PROVINCE', payload: record });
        dispatch({ type: 'SET_WARDS', payload: null });
        dispatch({ type: 'SET_SELECTED_WARD', payload: null });
    };

    const handleDistrictClick = (record) => {
        dispatch({ type: 'SET_SELECTED_DISTRICT', payload: record });
    };

    const handleWardClick = (record) => {
        dispatch({ type: 'SET_SELECTED_WARD', payload: record });
    };

    const handleDetailAddressChange = (e) => {
        dispatch({ type: 'SET_DETAIL_ADDRESS', payload: e.target.value });
    }

    useEffect(() => {
        console.log("Detail address:", state.detailAddress);
        if (state.detailAddress && state.provinceSelected && state.districtSelected && state.wardSelected)
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: false });
        else
            dispatch({
                type: 'SET_ENABLE_CONFIRM', payload: true
            });
    }, [state.detailAddress])

    useEffect(() => {
        const getDistricts = async () => {
            const URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district';
            try {
                const res = await axios({
                    method: "GET",
                    url: URL,
                    headers: {
                        'token': `${process.env.REACT_APP_GHV_KEY_TOKEN}`
                    },
                    params: {
                        province_id: state.provinceSelected.ProvinceID
                    }
                });
                if (res.status === 200) {
                    dispatch({ type: 'SET_DISTRICTS', payload: res.data.data });
                }
                else
                    console.log("Error");
            } catch (error) {
                console.log("Error fetch DISTRICTS:", error);
            }
        }
        getDistricts();
    }, [state.provinceSelected]);
    useEffect(() => {
        console.log("District selected:", state.districtSelected);
        const getWards = async () => {
            const URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward';
            try {
                const res = await axios({
                    method: "GET",
                    url: URL,
                    headers: {
                        'token': `${process.env.REACT_APP_GHV_KEY_TOKEN}`
                    },
                    params: {
                        district_id: state.districtSelected.DistrictID
                    }
                });
                if (res.status === 200) {
                    dispatch({ type: 'SET_WARDS', payload: res.data.data });
                }
                else
                    console.log("Error");
            } catch (error) {
                console.log("Error fetch WARDS:", error);
            }
        }
        getWards();
    }, [state.districtSelected]);

    useEffect(() => {
        console.log("Ward selected:", state.wardSelected);
    }, [state.wardSelected]);
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
                    dispatch({ type: 'SET_PROVINCES', payload: res.data.data });
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
            title: 'Tỉnh/Thành phố',
            dataIndex: 'ProvinceName',
            key: 'ProvinceID',
        }
    ];

    const districtColumns = [
        {
            title: 'Quận/Huyện',
            dataIndex: 'DistrictName',
            key: 'DistrictID',
        }
    ];
    const wardColumns = [
        {
            title: 'Phường/Xã',
            dataIndex: 'WardName',
            key: 'WardCode',
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
                    <Col span={20} className='flex items-center'>
                        <Input
                            value={state.shop_name}
                            onChange={handleInputChange}
                            name='shop_name'
                            placeholder='Nhập vào'
                            className='w-72' />
                        {state.touch.shop_name && state.errors.shop_name && <div className='text-red-500 ml-5'>{state.errors.shop_name}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='flex items-center mt-10'>
                    <Col span={4} className='flex justify-end font-semibold'>Logo của Shop</Col>
                    <Col span={20}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            fileList={state.imageUrl}
                            showUploadList={true}
                            maxCount={1}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {state.imageUrl.length < 1 && (
                                uploadButton
                            )}
                        </Upload>
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Mô tả Shop</Col>
                    <Col span={20} className='flex items-center'>
                        <Input.TextArea
                            value={state.shop_description}
                            onChange={handleInputChange}
                            placeholder='Nhập vào'
                            name='shop_description'
                            className='w-72'
                        />
                        {state.touch.shop_description && state.errors.shop_description && <div className='text-red-500 ml-5'>{state.errors.shop_description}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Họ và tên</Col>
                    <Col span={20} className='flex items-center'>
                        <Input
                            onChange={handleInputChange}
                            value={state.full_name}
                            placeholder='Nhập vào'
                            name='full_name'
                            className='w-72' />
                        {state.touch.full_name && state.errors.full_name && <div className='text-red-500 ml-5'>{state.errors.full_name}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>CCCD/CMND</Col>
                    <Col span={20} className='flex items-center'>
                        <Input
                            value={state.cccd}
                            onChange={handleInputChange}
                            placeholder='Nhập vào'
                            name='cccd'
                            className='w-72' />
                        {state.touch.cccd && state.errors.cccd && <div className='text-red-500 ml-5'>{state.errors.cccd}</div>}

                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Địa chỉ</Col>
                    <Col span={20}>
                        <Button
                            onClick={(e) => setIsModalVisible(true)}
                        >Thêm</Button>
                    </Col>
                </Row>
            </div>

            <Modal
                title="Thêm địa chỉ mới"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button disabled={state.enableConfirm} key="confirm" type="primary" onClick={handleConfirm}>Confirm</Button>

                ]}
            >
                <div className='flex flex-col'>
                    <Table
                        columns={provinceColumns}
                        dataSource={state.provinces}
                        pagination={false}
                        rowKey="province_id"
                        showHeader={true}
                        className='w-[100%] overflow-y-auto custom-scrollbar max-h-[200px] border-b mt-3'
                        onRow={(record) => ({
                            onClick: () => handleProvinceClick(record),
                            className: state.provinceSelected === record ? 'bg-gray-200' : ''
                        })}
                    />
                    <Table
                        columns={districtColumns}
                        dataSource={state.district}
                        pagination={false}
                        rowKey="sub_category_id"
                        showHeader={true}
                        className='w-[100%] overflow-y-auto custom-scrollbar max-h-[200px] mt-3'
                        onRow={(record) => ({
                            onClick: () => handleDistrictClick(record),
                            className: state.districtSelected === record ? 'bg-gray-200' : ''
                        })}
                    />
                    <Table
                        columns={wardColumns}
                        dataSource={state.ward}
                        pagination={false}
                        rowKey="sub_category_id"
                        showHeader={true}
                        className='w-[100%] overflow-y-auto custom-scrollbar max-h-[200px] mt-3'
                        onRow={(record) => ({
                            onClick: () => handleWardClick(record),
                            className: state.wardSelected === record ? 'bg-gray-200' : ''
                        })}
                    />
                    <div className='flex items-center flex-col justify-center'>
                        <span className='text-lg font-semibold'>Địa chỉ chi tiết</span>
                        <Input
                            value={state.detailAddress}
                            onChange={handleDetailAddressChange}
                            placeholder='Số nhà, tên đường, ...'
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BasicShopInformation