import { Button, message, notification, Popconfirm, Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux';
import { acceptReturnRequest, getReturnOrder, getReturnRequest, rejectReturnRequest } from '../../../services/return_request_Service';
import { format } from 'date-fns';
import { createNotification } from '../../../services/notificationsService';
import { set } from 'date-fns';
import DetailOrderModal from './DetailOrderModal';

const ReturnOrderTable = ({ return_type_id }) => {
    const shop = useSelector(state => state.shop);


    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_RETURN_REQUEST':
                    return { ...state, return_requests_fetch: action.payload, };
                case 'SET_DATA_SOURCE':
                    return { ...state, data_source: action.payload };
                case 'SET_LOADING':
                    return { ...state, loading: action.payload };
                case 'SET_VISBLE_MODAL_DETAIL':
                    return { ...state, visble_modal_detail: action.payload };
                case 'SET_ORDER_DETAIL':
                    return { ...state, order_detail: action.payload };
                case 'SET_CURRENT_PAGE':
                    return { ...state, current_page: action.payload };
                case 'SET_PAGE_SIZE':
                    return { ...state, page_size: action.payload };
                case 'SET_TOTAL_ITEMS':
                    return { ...state, totalItems: action.payload };
                default:
                    return state;
            }
        },
        {
            return_requests_fetch: null,
            data_source: [],
            loading: false,
            visble_modal_detail: false,
            order_detail: null,
            current_page: 1,
            page_size: 8,
            totalItems: 0,
        }
    )

    const handleReLoad = async () => {
        setTimeout(() => {
            const fetchReturnRequest = async () => {
                if (shop) {
                    const payload = {
                        shop_id: shop.shop_id,
                        return_type_id: return_type_id,
                        limit: localState.page_size,
                        page: localState.current_page,
                    };

                    const return_request_result = await getReturnRequest(payload);
                    if (return_request_result.success) {
                        console.log("Return request result:", return_request_result);
                        setLocalState({ type: "SET_RETURN_REQUEST", payload: return_request_result.data });
                    }
                    else {
                        console.log("Return request error:", return_request_result.message);
                    }
                }
            }
            fetchReturnRequest();
        },
            1000);
    }

    const handleAcceptReturnRequest = async (return_request_id, user_order_id) => {
        setLocalState({ type: "SET_LOADING", payload: true });
        const return_order = await getReturnOrder(user_order_id, shop.shop_id);
        if (return_order.success) {
            const order = return_order.data;

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


            const service_type_id = parseInt(user_address_id_string.split(",")[4], 10);
            const from_ward_name = order.user_address_string.split(",")[1].trim();
            const from_district_name = order.user_address_string.split(",")[2].trim();
            const from_province_name = order.user_address_string.split(",")[3].trim();

            const payload = {
                return_request_id: return_request_id,
                shopId: order.shop_id,
                user_order_id: user_order_id,
                payment_method_id: order.payment_method_id,
                shipping_fee: order.shipping_fee,
                note: order.order_note,
                required_note: "CHOTHUHANG", // required_note: "CHOTHUHANG, CHOXEMHANGKHONGTHU, KHONGCHOXEMHANG",
                from_name: order.UserAccount.full_name, // required
                from_phone: order.UserAccount.phone_number, // required
                from_address: order.user_address_string, // required
                from_ward_name: from_ward_name, // required
                from_district_name: from_district_name, // required
                from_province_name: from_province_name, // required
                to_name: order.Shop.full_name, // required
                to_phone: order.Shop.phone_number, // required
                to_address: order.Shop.shop_address, // required
                to_ward_code: order.Shop.ward_code, // required !!!!!!
                to_district_id: order.Shop.district_id, // required !!!!!!!!
                weight: sum_weight, // required 
                length: sum_length, // required
                width: sum_width, // required 
                height: sum_height, // required
                service_type_id: service_type_id, // required !!!!!!!!
                items: items,
            }
            // console.log("Accept return request payload:", payload);

            const accept_return_request = await acceptReturnRequest(payload);
            if (accept_return_request.success) {
                message.success("Chấp nhận đơn hàng trả hàng thành công");
                console.log("Accept return request success:", accept_return_request);
            }
            else {
                console.log("Error when accept return request:", accept_return_request.message);
                if (accept_return_request.status === 400 && accept_return_request.message === "Order status is not valid for return") {
                    message.error("Đơn hàng hiện tại đang ở trạng thái không thể trả hàng");
                }
                else
                    message.error("Có lỗi xảy ra");
            }
        }
        else {
            console.log("Error when get return order:", return_order.message);
            message.error("Có lỗi xảy ra khi lấy thông tin đơn hàng");
        }
        setLocalState({ type: "SET_LOADING", payload: false });
        handleReLoad();
    }

    const handleRejectReturnRequest = async (return_request_id, user_order_id) => {
        setLocalState({ type: "SET_LOADING", payload: true });
        const reject_return_request = await rejectReturnRequest({ return_request_id: return_request_id });
        if (reject_return_request.success) {
            message.success("Từ chối đơn hàng trả hàng thành công");
            console.log("Reject return request success:", reject_return_request);
        }
        else {
            console.log("Error when reject return request:", reject_return_request.message);
            message.error("Có lỗi xảy ra");
        }
        setLocalState({ type: "SET_LOADING", payload: false });
        handleReLoad();
    }

    const handleDetail = async (user_order_id) => {
        const return_order = await getReturnOrder(user_order_id, shop.shop_id);
        if (return_order.success) {
            const order = return_order.data;
            setLocalState({ type: "SET_ORDER_DETAIL", payload: order });
            console.log("Return order:", order);
            setLocalState({ type: "SET_VISBLE_MODAL_DETAIL", payload: true });
        }
        else {
            console.log("Error when get return order:", return_order.message);
            message.error("Có lỗi xảy ra khi lấy thông tin đơn hàng");
            setLocalState({ type: "SET_VISBLE_MODAL_DETAIL", payload: false });
        }
    }

    const column = [
        {
            title: "Đơn hàng",
            dataIndex: 'order_id',
            key: 'order_id',
            align: 'center',
            render: (text, record) => {
                return (
                    <div className='max-w-36 flex flex-col mx-auto'>
                        <span>{record.user_order_id} </span>
                    </div>
                )
            }

        },
        {
            title: "Số tiền",
            dataIndex: 'total_price',
            key: 'total_price',
            align: 'center',
            render: (text, record) => {
                return (
                    <div className='max-w-36 mx-auto'>
                        <p>{record.total_price}</p>
                    </div>
                )
            }

        },
        {
            title: "Lý do",
            dataIndex: 'reason',
            key: 'reason',
            align: 'center',
            render: (text, record) => {
                return (
                    <div className='max-w-36 mx-auto'>
                        <p>{record.reason}</p>
                    </div>
                )
            }
        },
        {
            title: "Ghi chú",
            dataIndex: 'note',
            key: 'note',
            align: 'center',
            render: (text, record) => {
                return (
                    <div className='max-w-36'>
                        <p>{record.note}</p>
                    </div>
                )
            }
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => {
                switch (status) {
                    case 1:
                        return "Chưa xử lý";
                    case 2:
                        return "Đã chấp nhận";
                    case 3:
                        return "Từ chối";
                    default:
                        return "Không xác định";
                }
            }
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
        },
        {
            title: "Thao tác",
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (text, record) => {
                return (
                    record.status === 1 ? (
                        <div className='max-w-36 mx-auto flex flex-col gap-3'>
                            <div>
                                <Popconfirm
                                    description="Bạn có chấp nhận yêu cầu trả hàng này không?"
                                    onConfirm={() => handleAcceptReturnRequest(record.key, record.user_order_id)}
                                    loading={localState.loading}
                                >
                                    <Button
                                        className='bg-primary text-white w-28 hover:bg-white hover:text-primary'
                                        type="primary">
                                        Xác nhận
                                    </Button>
                                </Popconfirm>

                            </div>
                            <div>
                                <Popconfirm
                                    description="Bạn có muốn từ chối yêu cầu trả hàng này không?"
                                    onConfirm={() => handleRejectReturnRequest(record.key, record.user_order_id)}
                                    loading={localState.loading}
                                >
                                    <Button
                                        className='bg-white text-primary w-28 hover:bg-primary hover:text-white'
                                    >
                                        Từ chối
                                    </Button>
                                </Popconfirm>

                            </div>
                            <div>
                                <div>
                                    <Button
                                        className='bg-white text-primary w-28 hover:bg-primary hover:text-white'
                                        onClick={() => handleDetail(record.user_order_id)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='max-w-36 mx-auto'>
                            <div>
                                <Button
                                    className='bg-white text-primary w-28 hover:bg-primary hover:text-white'
                                    onClick={() => handleDetail(record.user_order_id)}
                                >
                                    Xem chi tiết
                                </Button>
                            </div>
                        </div>

                    )
                );
            }
        }
    ]

    const createDataSource = () => {
        const dataSouce = localState.return_requests_fetch.map((return_request, index) => {
            return {
                key: return_request.return_request_id,
                user_order_id: return_request.user_order_id,
                total_price: return_request.UserOrder.final_price,
                reason: return_request.ReturnReason.return_reason_name,
                note: return_request.note,
                status: return_request.status_id,
                created_at: format(new Date(return_request.createdAt), 'HH:mm:ss dd-MM-yyyy'),

            }
        })

        return dataSouce;
    }



    useEffect(() => {
        if (localState.return_requests_fetch) {
            const data_source = createDataSource();
            setLocalState({ type: "SET_DATA_SOURCE", payload: data_source });
        }
    }, [localState.return_requests_fetch])

    useEffect(() => {
        const fetchReturnRequest = async () => {
            if (shop) {
                const payload = {
                    shop_id: shop.shop_id,
                    return_type_id: return_type_id,
                    limit: localState.page_size,
                    page: localState.current_page,
                };

                const return_request_result = await getReturnRequest(payload);
                if (return_request_result.success) {
                    console.log("Return request result:", return_request_result.data);
                    setLocalState({ type: "SET_RETURN_REQUEST", payload: return_request_result.data });
                    setLocalState({ type: "SET_TOTAL_ITEMS", payload: return_request_result.totalItems });
                }
                else {
                    console.log("Return request error:", return_request_result.message);
                }
            }
        }
        fetchReturnRequest();
    }, [
        shop,
        return_type_id,
        localState.page_size,
        localState.current_page
    ])

    const onChangePage = (page, pageSize) => {
        setLocalState({ type: "SET_CURRENT_PAGE", payload: page });
        setLocalState({ type: "SET_PAGE_SIZE", payload: pageSize });
    }


    return (
        <div className='rounded bg-white p-5'>
            <Table
                columns={column}
                dataSource={localState.data_source}
                pagination={{
                    total: localState.totalItems,
                    current: localState.current_page,
                    pageSize: localState.page_size,
                    onChange: onChangePage,
                }}
            />
            {
                localState.order_detail && (
                    <DetailOrderModal
                        visible={localState.visble_modal_detail}
                        onCancel={() => setLocalState({ type: "SET_VISBLE_MODAL_DETAIL", payload: false })}
                        order={localState?.order_detail}
                    />
                )
            }
          
        </div>
    )
}

export default ReturnOrderTable