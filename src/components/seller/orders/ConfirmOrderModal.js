import { Button, Col, message, Modal, Popconfirm, Row, Select, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { getDistricts, getProvinces, getWards } from '../../../services/ghnService';
import { comfirmOrder } from '../../../services/orderService';
import { createNotification } from '../../../services/notificationsService';
const { Option } = Select;

const ConfirmOrderModal = ({ visible, onCancel, order, handleReLoad }) => {

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
                case 'SET_CONFIRM_LOADING':
                    return { ...state, confirm_loading: action.payload };
                default:
                    return state;

            }
        },
        {
            from_province_name: "",
            from_district_name: "",
            from_ward_name: "",
            required_note: "KHONGCHOXEMHANG",
            confirm_loading: false
        }
    );

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 200,
            render: (_, record) => (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {record.ProductVarient.Product.product_name}
                </span>
            ),
            ellipsis: true,
        },
        {
            title: 'Phân loại',
            dataIndex: 'classify',
            key: 'classify',
            width: 150,
            render: (_, record) => (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {record.classify}
                </span>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',

        },
        {
            title: 'Đơn giá',
            dataIndex: 'ProductVarient.price',
            key: 'ProductVarient.price',
            render: (_, record) => record.ProductVarient.price,

        },
        {
            title: 'Giảm giá',
            dataIndex: 'ProductVarient.sale_percents',
            key: 'ProductVarient.sale_percents',
            render: (_, record) => record.ProductVarient.sale_percents + "%",

        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',

        },
    ];
    const requireNoteOptions = [
        { value: 'KHONGCHOXEMHANG', label: 'Không cho xem hàng' },
        { value: 'CHOXEMHANGKHONGTHU', label: 'Cho xem hàng không thử' },
        { value: 'CHOXEMHANGTHU', label: 'Cho xem hàng và thử hàng' },
    ];

    const handleRequiredNoteChange = (value) => {
        setModalState({ type: "SET_REQUIRED_NOTE", payload: value });
    }

    const handleConfirmOrder = async () => {
        setModalState({ type: "SET_CONFIRM_LOADING", payload: true });
        const items = order.UserOrderDetails.map(item => {
            return {
                name: item.ProductVarient.Product.product_name,
                quantity: item.quantity,
                weight: item.ProductVarient.weight,
                length: item.ProductVarient.length,
                width: item.ProductVarient.width,
                height: item.ProductVarient.height,
                price: item.ProductVarient.price
            }
        });
        const sum_weight = items.reduce((acc, item) => acc + item.weight, 0);
        const sum_length = items.reduce((acc, item) => acc + item.length, 0);
        const sum_width = items.reduce((acc, item) => acc + item.width, 0);
        const sum_height = items.reduce((acc, item) => acc + item.height, 0);
        const user_address_id_string = order.user_address_id_string;


        const province_id = user_address_id_string.split(",")[0];
        const to_district_id = parseInt(user_address_id_string.split(",")[1], 10);
        const to_ward_code = user_address_id_string.split(",")[2];
        const service_type_id = parseInt(user_address_id_string.split(",")[4], 10);
        const payload = {
            shopId: order.shop_id,
            user_order_id: order.user_order_id,
            payment_method_id: order.payment_method_id,
            shipping_fee: order.shipping_fee,
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
            to_ward_code: to_ward_code, // required !!!!!!
            to_district_id: to_district_id, // required !!!!!!!!
            // content,
            weight: sum_weight, // required 
            length: sum_length, // required
            width: sum_width, // required 
            height: sum_height, // required
            // pick_station_id,
            // deliver_station_id,
            // service_id,
            service_type_id: service_type_id, // required !!!!!!!!
            // coupon,
            // pick_shift,
            items: items,
        }

        const comfirmOrderResult = await comfirmOrder(payload);
        if (comfirmOrderResult.success) {
            console.log("Confirm order success", comfirmOrderResult);
            message.success("Xác nhận đơn hàng thành công");
            const noti_payload = {
                user_id: order.UserAccount.user_id,
                title: "Đơn hàng của bạn đã được xác nhận",
                content: `Đơn hàng của bạn đã được xác nhận và đang chờ vận chuyển`,
                notifications_type: "ORDER_CONFIRMED",
                thumbnail: "https://res.cloudinary.com/dhzjvbdnu/image/upload/v1731496563/hyddw7hk56lrjefuteoh.png",  
            }

            const noti_res = await createNotification(noti_payload);
            if(noti_res.success){
                console.log("Create notification success", noti_res);
            } else {
                console.error("Create notification error:", noti_res);
            }
            setTimeout(() => {
                handleReLoad();
            }, 1200);
        }
        else {
            console.error("Confirm order error:", comfirmOrderResult);
            message.error("Xác nhận đơn hàng thất bại");
        }
        setModalState({ type: "SET_CONFIRM_LOADING", payload: false });

    }



    useEffect(() => {
        const fetchAndSetProvinces = async () => {
            if (order) {
                try {
                    const provinces = await getProvinces();
                    const districts = await getDistricts(order.Shop.province_id);
                    const wards = await getWards(order.Shop.district_id);

                    if (provinces.data && districts.data && wards.data) {
                        const shop_province = provinces.data.find(province => province.ProvinceID === order.Shop.province_id);
                        const shop_district = districts.data.find(district => district.DistrictID === order.Shop.district_id);
                        const shop_ward = wards.data.find(ward => ward.WardCode === order.Shop.ward_code);

                        setModalState({ type: "SET_FROM_PROVINCE_NAME", payload: shop_province?.ProvinceName || "" });
                        setModalState({ type: "SET_FROM_DISTRICT_NAME", payload: shop_district?.DistrictName || "" });
                        setModalState({ type: "SET_FROM_WARD_NAME", payload: shop_ward?.WardName || "" });
                    } else {
                        console.error("Failed to fetch provinces, districts, or wards data");
                    }
                } catch (error) {
                    console.error("Error fetching provinces, districts, or wards:", error);
                }
            }
        };
        fetchAndSetProvinces();
    }, [order]);



    return (
        <div>
            <Modal
                title="Thông tin xác nhận đơn hàng"
                open={visible}
                onCancel={onCancel}
                width={window.innerWidth > 768 ? "50%" : "100%"}
                footer={[
                    <Button
                        key="cancel"
                        onClick={onCancel}
                        loading={modalState.confirm_loading}
                    >
                        Hủy
                    </Button>,
                    <Popconfirm
                        description="Khi xác nhận đơn hàng, đơn vị vận chuyển sẽ tiếp nhận và giao hàng cho khách hàng"
                        onConfirm={handleConfirmOrder}
                        loading={modalState.confirm_loading}
                        key={'confirm'}
                    >
                        <Button
                            // disabled={!state.enable_submit}
                            // loading={state.submit_loading}
                            loading={modalState.confirm_loading}
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

                                onChange={(value) => handleRequiredNoteChange(value)}
                            >
                                {requireNoteOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row className='mt-2 w-full'>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Thành tiền: </span>{order.total_price} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Phí vận chuyển: </span>{order.shipping_fee} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Phí vận chuyển được giảm: </span>{order.discount_shipping_fee} đ</p>
                        </Row>
                        <Row className='w-full justify-end'>
                            <p className='text-[15px]'><span className='font-semibold'>Tổng cộng: </span>{order.final_price} đ</p>
                        </Row>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}

export default ConfirmOrderModal