import { Button, Col, message, Modal, Popconfirm, Row, Select, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { getDistricts, getProvinces, getWards } from '../../../services/ghnService';
import { FaCopy } from "react-icons/fa";
const { Option } = Select;
const DetailOrderModal = ({ visible, onCancel, order }) => {

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
    const handleCopy = () => {
        navigator.clipboard.writeText(order.order_code)
            .then(() => {
                message.success('Mã vận đơn đã được sao chép!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };
    return (
        <div>
            <Modal
                title="Thông tin đơn hàng"
                open={visible}
                onOk={onCancel}
                onCancel={onCancel}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        Đóng
                    </Button>,
                ]}
                // make width responsive
                width={window.innerWidth > 768 ? "50%" : "100%"}
            >
                <div>
                    <Row gutter={12}>
                        {
                            order.order_code !== null && (
                                <Col span={12}className="flex gap-3 text-lg">
                                    <span className='font-semibold'>Mã vận đơn</span>: {order.order_code}
                                    <FaCopy onClick={handleCopy} size={20} className="cursor-pointer text-primary"  />
                                </Col>
                            )
                        }
                    </Row>
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
                                className='w-full'
                            />
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

export default DetailOrderModal