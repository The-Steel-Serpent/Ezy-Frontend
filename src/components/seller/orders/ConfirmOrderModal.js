import { Button, Col, Modal, Popconfirm, Row, Select, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { getDistricts, getProvinces, getWards } from '../../../services/ghnService';
const { Option } = Select;

const ConfirmOrderModal = ({ visible, onCancel, order }) => {

    const [modalState, setModalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_FROM_PROVINCE_NAME':
                    return { ...state, from_province_name: action.payload };
                case 'SET_FROM_DISTRICT_NAME':
                    return { ...state, from_district_name: action.payload };
                case 'SET_FROM_WARD_NAME':
                    return { ...state, from_ward_name: action.payload };
                case 'SET_REQUIRED_NOTE':
                    return { ...state, required_note: action.payload };
                default:
                    return state;

            }
        },
        {
            from_province_name: "",
            from_district_name: "",
            from_ward_name: "",
            required_note: "KHONGCHOXEMHANG",
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
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.ProductVarient.price),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];
    const requireNoteOptions = [
        { value: 'KHONGCHOXEMHANG', label: 'Không cho xem hàng' },
        { value: 'CHOXEMHANGKHONGTHU', label: 'Cho xem hàng không thử' },
        { value: 'CHOXEMHANGTHU', label: 'Cho xem hàng và thử hàng' },
    ];
    const handleConfirmOrder = async () => {
        const items = order.UserOrderDetails.map(item => {
            return {
                name: item.ProductVarient.Product.product_name,
                weight: item.ProductVarient.weight,
                length: item.ProductVarient.length,
                width: item.ProductVarient.width,
                height: item.ProductVarient.height,
                quantity: item.quantity,
                price: item.ProductVarient.price
            }
        });
        const sum_weight = items.reduce((acc, item) => acc + item.weight, 0);
        const sum_length = items.reduce((acc, item) => acc + item.length, 0);
        const sum_width = items.reduce((acc, item) => acc + item.width, 0);
        const sum_height = items.reduce((acc, item) => acc + item.height, 0);
        const payload = {
            shopId: order.shop_id,
            user_order_id: order.user_order_id,
            payment_method_id: order.payment_method_id,
            note: order.order_note,
            required_note: modalState.required_note, // required_note: "CHOTHUHANG, CHOXEMHANGKHONGTHU, KHONGCHOXEMHANG",
            from_name: order.Shop.full_name, // required
            from_phone: order.Shop.phone_number, // required
            from_address: order.Shop.shop_address, // required
            from_ward_name: modalState.from_ward_name, // required
            from_district_name: modalState.from_district_name, // required
            from_province_name: modalState.from_province_name, // required
            // return_phone,
            // return_address,
            // return_district_id,
            // return_ward_code,
            // client_order_code,
            to_name: order.UserAccount.full_name, // required
            to_phone: order.UserAccount.phone_number, // required
            to_address: order.user_address_string, // required
            // to_ward_code, // required !!!!!!
            // to_district_id, // required !!!!!!!!
            // content,
            weight: sum_weight, // required 
            length: sum_length, // required
            width: sum_width, // required 
            height: sum_height, // required
            // pick_station_id,
            // deliver_station_id,
            // service_id,
            // service_type_id, // required !!!!!!!!
            // coupon,
            // pick_shift,
            items: items,
        }

        console.log("payload confirm", payload);
    }



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
                title="Thông tin xác nhận đơn hàng"
                open={visible}
                onCancel={onCancel}
                footer={[
                    <Button
                        key="cancel"
                        onClick={onCancel}
                    // loading={state.submit_loading}
                    >
                        Hủy
                    </Button>,
                    <Popconfirm
                        description="Khi xác nhận đơn hàng, đơn vị vận chuyển sẽ tiếp nhận và giao hàng cho khách hàng"
                        onConfirm={handleConfirmOrder}
                        key={'confirm'}
                    >
                        <Button
                            // disabled={!state.enable_submit}
                            // loading={state.submit_loading}
                            type="primary">
                            Xác nhận
                        </Button>
                    </Popconfirm>
                ]}
            >
                <div>
                    <Row gutter={12}>
                        {/* Order info from payload */}
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
                    <Row className='mt-3'>
                        <Col span={24}>
                            <p className='text-lg font-semibold'>Yêu cầu ghi chú</p>
                            <Select
                                defaultValue={requireNoteOptions[0].value}
                                style={{ width: 200 }}
                                onChange={(value) => setModalState({ type: "SET_REQUIRED NOTE", payload: value })}
                            >
                                {requireNoteOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}

export default ConfirmOrderModal