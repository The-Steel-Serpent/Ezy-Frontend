import { Button, Col, Row, message, Upload, Input, Select, Table, Modal } from 'antd';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddressModal from '../address/AddressModal';

const BasicShopInformation = ({ onData }) => {
    const location = useLocation();
    const isSellerSetupPath = location.pathname === '/seller/seller-setup';
    const [isModalVisible, setIsModalVisible] = useState(false);

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
        address_full: '',
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
            case 'SET_ADDRESS_FULL':
                return { ...state, address_full: action.payload };
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
    const beforeUpload = file => {
        const isImage = file.type.startsWith('image/');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
            return Upload.LIST_IGNORE;
        }
        if (!isLt2M) {
            message.error('Kích thước tập tin vượt quá 2.0 MB');
            return Upload.LIST_IGNORE;
        }
        return true;
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleConfirm = () => {
        setIsModalVisible(false);
        dispatch({ type: 'SET_SUBMITTED', payload: true });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = ({ fileList: newList }) => {
        if (newList.length > 1) {
            newList.shift();
        }
        dispatch({ type: 'SET_IMAGE_URL', payload: newList });
    };

    const handleRemove = (file) => {
        dispatch({ type: 'SET_IMAGE_URL', payload: state.imageUrl.filter(item => item.uid !== file.uid) });
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

        // Validate address
        if (state.detailAddress === '')
            valid = false;
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        return valid;
    };

    useEffect(() => {
        const check = validate();
        if (check && state.provinceSelected && state.districtSelected && state.wardSelected && state.imageUrl.length > 0) {
            const data = {
                shop_name: state.shop_name,
                shop_description: state.shop_description,
                full_name: state.full_name,
                citizen_number: state.cccd,
                imageUrl: state.imageUrl,
                province_id: state.provinceSelected.ProvinceID,
                district_id: state.districtSelected.DistrictID,
                ward_code: state.wardSelected.WardCode,
                shop_address: state.detailAddress,
                noErrorBasicInfo: true
            };
            onData(data);
        } else {
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

    const handleProvinceClick = (value) => {
        const selectedProvince = state.provinces.find(province => province.ProvinceID === value);
        dispatch({ type: 'SET_SELECTED_PROVINCE', payload: selectedProvince });
        dispatch({ type: 'SET_WARDS', payload: null });
        dispatch({ type: 'SET_SELECTED_WARD', payload: null });
    };

    const handleDistrictClick = (value) => {
        const selectedDistrict = state.district.find(district => district.DistrictID === value);
        dispatch({ type: 'SET_SELECTED_DISTRICT', payload: selectedDistrict });
    };

    const handleWardClick = (value) => {
        const selectedWard = state.ward.find(ward => ward.WardCode === value);
        dispatch({ type: 'SET_SELECTED_WARD', payload: selectedWard });
    };

    const handleDetailAddressChange = (e) => {
        dispatch({ type: 'SET_DETAIL_ADDRESS', payload: e.target.value });
    };

    useEffect(() => {
        if (state.detailAddress && state.provinceSelected && state.districtSelected && state.wardSelected) {
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: false });
            dispatch({ type: 'SET_ADDRESS_FULL', payload: `${state.detailAddress}, ${state.wardSelected.WardName}, ${state.districtSelected.DistrictName}, ${state.provinceSelected.ProvinceName}` });
        }
        else
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: true });
    }, [state.detailAddress]);

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
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error fetch DISTRICTS:", error);
            }
        };
        getDistricts();
    }, [state.provinceSelected]);

    useEffect(() => {
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
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error fetch WARDS:", error);
            }
        };
        getWards();
    }, [state.districtSelected]);

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
                } else {
                    console.log("Error");
                }
            } catch (error) {
                console.log("Error fetch provinces:", error);
            }
        };
        getProvinces();
    }, []);

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
                            onRemove={handleRemove}
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
                        >
                            {state.address_full ? state.address_full : 'Chọn địa chỉ'}
                        </Button>
                    </Col>
                </Row>
            </div>

            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
                handleProvinceClick={handleProvinceClick}
                handleDistrictClick={handleDistrictClick}
                handleWardClick={handleWardClick}
                handleDetailAddressChange={handleDetailAddressChange}
                state={state}
            />
        </div>
    )
}

export default BasicShopInformation