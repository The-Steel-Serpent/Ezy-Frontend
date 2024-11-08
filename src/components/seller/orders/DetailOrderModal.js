import { Button, Col, message, Modal, Popconfirm, Row, Select, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { getDistricts, getProvinces, getWards } from '../../../services/ghnService';
const { Option } = Select;

const DetailOrderModal = ({ visible, onCancel, order, handleReLoad }) => {

    const [modalState, setModalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_FROM_PROVINCE_NAME':
                    return { ...state, from_province_name: action.payload };
                case 'SET_FROM_DISTRICT_NAME':
                    return { ...state, from_district_name: action.payload };
                case 'SET_FROM_WARD_NAME':
                    return { ...state, from_ward_name: action.payload };
                default:
                    return state;

            }
        },
        {
            from_province_name: "",
            from_district_name: "",
            from_ward_name: "",
        }
    );

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name',
            render: (_, record) => record.ProductVarient.Product.product_name,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];

    useEffect(() => {
        const fetchAndSetProvinces = async () => {
            if (order) {
                const provinces = await getProvinces();
                const districts = await getDistricts(order.Shop.province_id);
                const wards = await getWards(order.Shop.district_id);
                // get province name by province_id
                const shop_province = provinces.data.find(province => province.ProvinceID === order.Shop.province_id);
                const shop_district = districts.data.find(district => district.DistrictID === order.Shop.district_id);
                const shop_ward = wards.data.find(ward => ward.WardCode === order.Shop.ward_code);

                setModalState({ type: "SET_FROM_PROVINCE_NAME", payload: shop_province.ProvinceName });
                setModalState({ type: "SET_FROM_DISTRICT_NAME", payload: shop_district.DistrictName });
                setModalState({ type: "SET_FROM_WARD_NAME", payload: shop_ward.WardName });

            }
        };
        fetchAndSetProvinces();
    }, [order])

    return (
        <div>
            <Modal
                title="Thông tin đơn hàng"
                open={visible}
                onCancel={onCancel}
            >
                <div>
                    <Row gutter={12}>
                        <Col span={12}>
                            <p className='text-lg font-semibold'>Thông tin người gửi</p>
                            <p><span className='font-semibold'>Người gửi</span>: {order.Shop.full_name}</p>
                            <p><span className='font-semibold'>SĐT</span>: {order.Shop.phone_number}</p>
                            <p><span className='font-semibold'>Địa chỉ</span>: {order.Shop.shop_address}, {modalState.from_ward_name}, {modalState.from_district_name}, {modalState.from_province_name}</p>
                        </Col>
                        <Col span={12}>
                            <p className='text-lg font-semibold'>Thông tin người nhận</p>
                            <p><span className='font-semibold'>Người nhận</span>: {order.UserAccount.full_name}</p>
                            <p><span className='font-semibold'>SĐT</span>: {order.UserAccount.phone_number}</p>
                            <p><span className='font-semibold'>Địa chỉ</span>: {order.user_address_string}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <p className='text-lg font-semibold'>Danh sách sản phẩm</p>
                            <Table
                                columns={columns}
                                dataSource={order.UserOrderDetails}
                                rowKey="product_varient_id"
                                pagination={false}
                            />
                        </Col>
                    </Row>
                    <Row className='mt-2 w-full'>
                        <Row className='w-full flex justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Giảm giá: </span>{order.discount_price} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Giá gốc: </span>{order.final_price} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Phí ship: </span>{order.shipping_fee} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Giảm phí ship: </span>{order.discount_shipping_fee} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Thành tiền: </span>{order.total_price} đ</p>
                        </Row>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}

export default DetailOrderModal