import React from 'react';
import { Modal, Button, Select, Input } from 'antd';
const { Option } = Select;

const AddressModal = ({
    isModalVisible,
    handleCancel,
    handleConfirm,
    handleProvinceClick,
    handleDistrictClick,
    handleWardClick,
    handleDetailAddressChange,
    state
}) => {
    return (
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
                <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={handleProvinceClick}
                    value={state.provinceSelected ? state.provinceSelected.ProvinceID : undefined}
                >
                    {state.provinces.map(province => (
                        <Option key={province.ProvinceID} value={province.ProvinceID}>
                            {province.ProvinceName}
                        </Option>
                    ))}
                </Select>
                <Select
                    placeholder="Chọn Quận/Huyện"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={handleDistrictClick}
                    value={state.districtSelected ? state.districtSelected.DistrictID : undefined}
                >
                    {state.district.map(district => (
                        <Option key={district.DistrictID} value={district.DistrictID}>
                            {district.DistrictName}
                        </Option>
                    ))}
                </Select>
                <Select
                    placeholder="Chọn Phường/Xã"
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={handleWardClick}
                    value={state.wardSelected ? state.wardSelected.WardCode : undefined}
                >
                    {state.ward && state.ward.map(ward => (
                        <Option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                        </Option>
                    ))}
                </Select>
                <Input
                    placeholder='Nhập vào địa chỉ chi tiết'
                    onChange={handleDetailAddressChange}
                />
            </div>
        </Modal>
    );
};

export default AddressModal;