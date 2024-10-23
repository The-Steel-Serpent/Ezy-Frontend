import React, { useEffect, useReducer } from 'react'
import SellerEditProfileHeader from '../../components/setup/SellerEditProfileHeader';
import { Button, Col, Input, message, Row, Upload } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getDistricts, getProvinces, getWards } from '../../services/ghnService';
import AddressModal from '../../components/address/AddressModal';
import { RiImageAddFill } from 'react-icons/ri';
import { checkNumberPhone } from '../../helpers/formatPhoneNumber';
import LoadingModal from '../../components/loading/LoadingModal';
import uploadFile from '../../helpers/uploadFile';
import { updateShopProfile } from '../../services/shopService';
import { setShop } from '../../redux/shopSlice';

const initialState = {
    disable_fields: true,
    shop_name: '',
    shop_description: '',
    full_name: '',
    citizen_number: '',
    phone_number: '',
    district_id: null,
    province_id: null,
    ward_id: null,
    shop_address: null,
    address_full: null,
    fileList: [],
    provinces: [],
    district: [],
    ward: [],
    provinceSelected: null,
    districtSelected: null,
    wardSelected: null,
    isModalVisible: false,
    isSubmitted: false,
    detailAddress: null,
    enableConfirm: true,
    image_has_changed: false,
    touch: {
        shop_name: false,
        shop_description: false,
        full_name: false,
        citizen_number: false,
        phone_number: false,
        address_full: false
    },
    errors: {
        shop_name: '',
        shop_description: '',
        full_name: '',
        citizen_number: '',
        phone_number: '',
        address_full: ''
    },
    submit_loading: false,
    payload_save: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DISABLE_FIELDS':
            return { ...state, disable_fields: action.payload }
        case 'SET_SHOP_NAME':
            return { ...state, shop_name: action.payload }
        case 'SET_SHOP_DESCRIPTION':
            return { ...state, shop_description: action.payload }
        case 'SET_FILE_LIST':
            return { ...state, fileList: action.payload }
        case 'SET_FULL_NAME':
            return { ...state, full_name: action.payload }
        case 'SET_CITIZEN_NUMBER':
            return { ...state, citizen_number: action.payload }
        case 'SET_PHONE_NUMBER':
            return { ...state, phone_number: action.payload }
        case 'SET_DISTRICT_ID':
            return { ...state, district_id: action.payload }
        case 'SET_PROVINCE_ID':
            return { ...state, province_id: action.payload }
        case 'SET_WARD_ID':
            return { ...state, ward_id: action.payload }
        case 'SET_SHOP_ADDRESS':
            return { ...state, shop_address: action.payload }
        case 'SET_ADDRESS_FULL':
            return { ...state, address_full: action.payload }
        case 'SET_PROVINCES':
            return { ...state, provinces: action.payload }
        case 'SET_DISTRICT':
            return { ...state, district: action.payload }
        case 'SET_WARD':
            return { ...state, ward: action.payload }
        case 'SET_SELECTED_PROVINCE':
            return { ...state, provinceSelected: action.payload }
        case 'SET_SELECTED_DISTRICT':
            return { ...state, districtSelected: action.payload }
        case 'SET_SELECTED_WARD':
            return { ...state, wardSelected: action.payload }
        case 'SET_DETAIL_ADDRESS':
            return { ...state, detailAddress: action.payload };
        case 'SET_IS_MODAL_VISIBLE':
            return { ...state, isModalVisible: action.payload }
        case 'SET_SUBMITTED':
            return { ...state, isSubmitted: action.payload }
        case 'SET_ENABLE_CONFIRM':
            return { ...state, enableConfirm: action.payload }
        case 'SET_LOGO_URL':
            return { ...state, logo_url: action.payload }
        case 'SET_IMAGE_HAS_CHANGED':
            return { ...state, image_has_changed: action.payload }
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
        case 'SET_SUBMIT_LOADING':
            return { ...state, submit_loading: action.payload }
        case 'SET_PAYLOAD_SAVE':
            return { ...state, payload_save: action.payload }
        default:
            return state
    }
}

const uploadButton = (
    <button
        style={{
            border: 0,
            background: 'none',
        }}
        type="button"
    >
        {<RiImageAddFill size={25} />}
    </button>
);

const SellerEditProfileBasic = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const shop = useSelector(state => state.shop);
    const dispatchShop = useDispatch();


    const handleEditButton = () => {
        dispatch({ type: 'SET_DISABLE_FIELDS', payload: state.disable_fields ? false : true });
    }

    const handleCancelEdit = () => {
        window.location.reload();
    }

    // upload handle

    const handleUploadChange = ({ fileList }) => {
        dispatch({ type: 'SET_FILE_LIST', payload: fileList });
        if (fileList.length > 0 && fileList[0].status === 'done') {
            dispatch({ type: 'SET_LOGO_URL', payload: fileList[0].response.url });
        }
    }





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

    const handleOnRemove = () => {
        dispatch({ type: 'SET_IMAGE_HAS_CHANGED', payload: true });
    }

    // handle input and validate
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
        dispatch({ type: 'SET_TOUCHED', payload: name });
    };


    const validate = () => {
        let valid = true;
        let newErrors = { shop_name: '', shop_description: '', full_name: '', citizen_number: '', phone_number: '', address_full: '' };
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
        if (!state.citizen_number.trim()) {
            newErrors.citizen_number = 'CCCD/CMND không được để trống';
            valid = false;
        } else if (state.citizen_number.length !== 10) {
            newErrors.citizen_number = 'CCCD/CMND phải có đúng 10 số';
            valid = false;
        } else if (isNaN(state.citizen_number)) {
            newErrors.citizen_number = 'CCCD/CMND phải là số';
            valid = false;
        }

        // Validate phone number
        const errorPhoneNumber = checkNumberPhone(state.phone_number);
        if (errorPhoneNumber !== "") {
            newErrors.phone_number = errorPhoneNumber;
            valid = false;
        }
        // Validate address
        if (state.detailAddress === '')
            valid = false;
        dispatch({ type: 'SET_ERRORS', payload: newErrors });
        if (state.address_full === '') {
            newErrors.address_full = 'Địa chỉ không được để trống';
            dispatch({ type: 'SET_TOUCHED', payload: 'address_full' });
        }
        return valid;
    };

    useEffect(() => {
        const check = validate();
        if (
            check &&
            state.provinceSelected &&
            state.districtSelected &&
            state.wardSelected &&
            state.fileList.length > 0 &&
            state.detailAddress
        ) {
            const data = {
                shop_id: shop.shop_id,
                shop_name: state.shop_name,
                shop_description: state.shop_description,
                full_name: state.full_name,
                citizen_number: state.citizen_number,
                fileList: state.fileList,
                province_id: state.provinceSelected.ProvinceID,
                district_id: state.districtSelected.DistrictID,
                ward_code: state.wardSelected.WardCode,
                shop_address: state.detailAddress,
                phone_number: state.phone_number,
            };
            console.log("Update payload", data);
            dispatch({ type: 'SET_PAYLOAD_SAVE', payload: data });
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: false });
        } else {
            console.log("Update payload error");
            dispatch({ type: 'SET_PAYLOAD_SAVE', payload: null });
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: true });
        }
    }, [
        state.shop_name,
        state.shop_description,
        state.full_name,
        state.citizen_number,
        state.provinces,
        state.district,
        state.ward,
        state.phone_number,
        state.detailAddress,
        state.fileList,
        state.provinceSelected,
        state.districtSelected,
        state.wardSelected
    ]);

    useEffect(() => {
        if (shop) {
            dispatch({ type: 'SET_SHOP_NAME', payload: shop.shop_name });
            dispatch({ type: 'SET_SHOP_DESCRIPTION', payload: shop.shop_description });
            dispatch({ type: 'SET_FULL_NAME', payload: shop.full_name });
            dispatch({ type: 'SET_CITIZEN_NUMBER', payload: shop.citizen_number });
            dispatch({ type: 'SET_PHONE_NUMBER', payload: shop.phone_number });
            dispatch({ type: 'SET_DISTRICT_ID', payload: shop.district_id });
            dispatch({ type: 'SET_WARD_ID', payload: shop.ward_id });
            dispatch({ type: 'SET_PROVINCE_ID', payload: shop.province_id });
            dispatch({ type: 'SET_SHOP_ADDRESS', payload: shop.shop_address });
            dispatch({
                type: 'SET_FILE_LIST', payload: [
                    { uid: '-1', name: 'image.png', status: 'done', url: shop.logo_url }
                ]
            });
        }
    }, [shop])

    // handle address
    const handleCancel = () => {
        dispatch({ type: 'SET_IS_MODAL_VISIBLE', payload: false });
    };
    const handleProvinceClick = (value) => {
        const selectedProvince = state.provinces.find(province => province.ProvinceID === value);
        dispatch({ type: 'SET_SELECTED_PROVINCE', payload: selectedProvince });
        dispatch({ type: 'SET_SELECTED_DISTRICT', payload: null });
        dispatch({ type: 'SET_SELECTED_WARD', payload: null });
        console.log(selectedProvince);

    };

    const handleDistrictClick = (value) => {
        const selectedDistrict = state.district.find(district => district.DistrictID === value);
        dispatch({ type: 'SET_SELECTED_DISTRICT', payload: selectedDistrict });
        dispatch({ type: 'SET_SELECTED_WARD', payload: null });
    };

    const handleWardClick = (value) => {
        const selectedWard = state.ward.find(ward => ward.WardCode === value);
        dispatch({ type: 'SET_SELECTED_WARD', payload: selectedWard });
    };


    const handleDetailAddressChange = (e) => {
        dispatch({ type: 'SET_DETAIL_ADDRESS', payload: e.target.value });
    };

    const handleConfirm = () => {
        dispatch({ type: 'SET_IS_MODAL_VISIBLE', payload: false });
        dispatch({ type: 'SET_SUBMITTED', payload: true });
    };

    // get address full
    const setAddressFull = async (provinces, province_id, district_id, ward_id, shop_address) => {
        let ProvinceName = '';
        let DistrictName = '';
        let WardName = '';
        if (province_id) {
            const shop_province = provinces.find(province => province.ProvinceID === province_id);
            dispatch({ type: 'SET_SELECTED_PROVINCE', payload: shop_province });
            ProvinceName = shop_province.ProvinceName;
            if (district_id) {
                const districts = await getDistricts(province_id);
                const shop_district = districts.data.find(district => district.DistrictID === district_id);
                dispatch({ type: 'SET_SELECTED_DISTRICT', payload: shop_district });
                DistrictName = shop_district.DistrictName;
                if (ward_id) {
                    const wards = await getWards(district_id);
                    const shop_ward = wards.data.find(ward => ward.WardCode === ward_id);
                    dispatch({ type: 'SET_SELECTED_WARD', payload: shop_ward });
                    WardName = shop_ward.WardName;
                }
            }
            dispatch({ type: 'SET_DETAIL_ADDRESS', payload: shop_address });
            dispatch({ type: 'SET_ADDRESS_FULL', payload: `${shop_address}, ${WardName}, ${DistrictName}, ${ProvinceName}` });
        }
    }

    // get provinces
    useEffect(() => {
        (async () => {
            const res = await getProvinces();
            if (res.data) {
                dispatch({ type: 'SET_PROVINCES', payload: res.data });
                // set address full
                if (shop) {
                    setAddressFull(res.data, shop.province_id, shop.district_id, shop.ward_code, shop.shop_address);
                }
            }
        })()
    }, [])
    // get districts
    useEffect(() => {
        (async () => {
            if (state.provinceSelected) {
                const res = await getDistricts(state.provinceSelected.ProvinceID);
                if (res.data) {
                    dispatch({ type: 'SET_DISTRICT', payload: res.data });
                    console.log(res.data);
                }
            }
        })()
    }, [state.provinceSelected]);


    // get wards
    useEffect(() => {
        (async () => {
            if (state.districtSelected) {
                const res = await getWards(state.districtSelected.DistrictID);
                if (res.data) {
                    dispatch({ type: 'SET_WARD', payload: res.data });
                    console.log(res.data);
                }
            }
        })()
    }, [state.districtSelected]);

    // enable confirm button
    useEffect(() => {
        if (state.detailAddress && state.provinceSelected && state.districtSelected && state.wardSelected) {
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: false });
            dispatch({ type: 'SET_ADDRESS_FULL', payload: `${state.detailAddress}, ${state.wardSelected.WardName}, ${state.districtSelected.DistrictName}, ${state.provinceSelected.ProvinceName}` });
        }
        else {
            dispatch({ type: 'SET_ENABLE_CONFIRM', payload: true });
            dispatch({ type: 'SET_ADDRESS_FULL', payload: '' });
        }
    }, [state.detailAddress, state.provinceSelected, state.districtSelected, state.wardSelected]);


    const handleSave = async () => {
        let payload;
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        if (state.payload_save) {
            payload = state.payload_save;
            if (state.image_has_changed) {
                const upload = await uploadFile(state.payload_save.fileList[0].originFileObj, 'seller-img');
                console.log("Upload bro", upload);
                payload.logo_url = upload.url;
            }
            try {
                const res = await updateShopProfile(payload);
                console.log("Update shop profile successfully", res.data);
                message.success('Cập nhật thông tin thành công');
                dispatchShop(setShop(res.data));
                dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
            } catch (error) {
                console.log("Error update shop profile", error);
                dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
                message.error('Cập nhật thông tin thất bại');
            }
        }

    }

    return (
        <div>
            <SellerEditProfileHeader status={'/seller/seller-edit-profile'} />
            <div className='mt-3 ml-10 bg-white py-5 my-10 rounded'>
                <div className='flex justify-between px-8 mb-5'>
                    <h3 className='text-lg'>Thông tin cơ bản</h3>
                    <Button
                        onClick={handleEditButton}
                    >Chỉnh sửa</Button>
                </div>
                <Row gutter={12} className='flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>
                        Tên Shop
                    </Col>
                    <Col span={20} className='flex items-center'>
                        <Input
                            value={state.shop_name}
                            disabled={state.disable_fields}
                            onChange={handleInputChange}
                            name='shop_name'
                            placeholder='Nhập vào'
                            className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
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
                            disabled={state.disable_fields}
                            fileList={state.fileList}
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            onRemove={handleOnRemove}
                            onChange={handleUploadChange}
                        >
                            {state.fileList.length < 1 && (
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
                            disabled={state.disable_fields}
                            onChange={handleInputChange}
                            placeholder='Nhập vào'
                            name='shop_description'
                            className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}

                        />
                        {state.touch.shop_description && state.errors.shop_description && <div className='text-red-500 ml-5'>{state.errors.shop_description}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Họ và tên</Col>
                    <Col span={20} className='flex items-center'>
                        <Input
                            value={state.full_name}
                            onChange={handleInputChange}
                            disabled={state.disable_fields}
                            placeholder='Nhập vào'
                            name='full_name'
                            className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
                        {state.touch.full_name && state.errors.full_name && <div className='text-red-500 ml-5'>{state.errors.full_name}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>CCCD/CMND</Col>
                    <Col span={20} className='flex items-center'>
                        <Input
                            value={state.citizen_number}
                            disabled={state.disable_fields}
                            onChange={handleInputChange}
                            placeholder='Nhập vào'
                            name='citizen_number'
                            className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
                        {state.touch.citizen_number && state.errors.citizen_number && <div className='text-red-500 ml-5'>{state.errors.citizen_number}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Số điện thoại</Col>
                    <Col span={20} className='flex items-center'>
                        <Input
                            value={state.phone_number}
                            disabled={state.disable_fields}
                            onChange={handleInputChange}
                            placeholder='Nhập vào'
                            name='phone_number'
                            className={`w-72 ${state.disable_fields ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
                        {state.touch.phone_number && state.errors.phone_number && <div className='text-red-500 ml-5'>{state.errors.phone_number}</div>}
                    </Col>
                </Row>
                <Row gutter={12} className='mt-10 flex items-center'>
                    <Col span={4} className='flex justify-end font-semibold'>Địa chỉ</Col>
                    <Col span={20} className='flex items-center'>
                        <Button
                            onClick={(e) => dispatch({ type: 'SET_IS_MODAL_VISIBLE', payload: true })}
                            disabled={state.disable_fields}
                            className={`${state.disable_fields ? 'bg-gray-100 text-gray-500' : 'bg-white text-black'}`}
                        >
                            {state.address_full ? state.address_full : 'Chọn địa chỉ'}
                        </Button>
                        {state.touch.address_full && !state.address_full && <div className='text-red-500 ml-5'>Địa chỉ không được để trống</div>}
                    </Col>
                </Row>
                {!state.disable_fields && (
                    <div className='flex gap-3 justify-end mr-10 mt-10'>
                        <Button
                            disabled={state.enableConfirm}
                            onClick={async () => await handleSave()}
                        >
                            Lưu
                        </Button>
                        <Button
                            onClick={handleCancelEdit}
                        >
                            Hủy
                        </Button>
                    </div>
                )}

            </div>
            {/* Address Modal */}
            <AddressModal
                isModalVisible={state.isModalVisible}
                handleCancel={handleCancel}
                handleConfirm={handleConfirm}
                handleProvinceClick={handleProvinceClick}
                handleDistrictClick={handleDistrictClick}
                handleWardClick={handleWardClick}
                handleDetailAddressChange={handleDetailAddressChange}
                state={state}
            />
            {/* Loading Modal */}
            <LoadingModal visible={state.submit_loading} />
        </div>
    )
}

export default SellerEditProfileBasic