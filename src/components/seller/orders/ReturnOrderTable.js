import { Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux';
import { getReturnRequest } from '../../../services/return_request_Service';

const ReturnOrderTable = ({ return_type_id }) => {
    const shop = useSelector(state => state.shop);


    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_RETURN_REQUEST':
                    return { ...state, return_requests_fetch: action.payload, };
                case 'SET_DATA_SOURCE':
                    return { ...state, data_source: action.payload };
                default:
                    return state;
            }
        },
        {
            return_requests_fetch: null,
            data_source: [],

        }
    )


    const column = [
        {
            title: "Đơn hàng",
            dataIndex: 'order_id',
            key: 'order_id',

        },
        {
            title: "Số tiền",
            dataIndex: 'total_price',
            key: 'total_price',

        },
        {
            title: "Lý do",
            dataIndex: 'reason',
            key: 'reason',
            render: (text, record) => {
                return (
                    <div className='max-w-36'>
                        <p>{record.reason}</p>
                    </div>
                )
            }
        },
        {
            title: "Ghi chú",
            dataIndex: 'note',
            key: 'note',
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
            key: 'status'
        },
        {
            title: "Ngày yêu cầu",
            dataIndex: 'created_at',
            key: 'created_at',
        }
    ]

    const createDataSource = () => {
        const dataSouce = localState.return_requests_fetch.map((return_request, index) => {
            return {
                key: return_request.return_request_id,
                order_id: return_request.user_order_id,
                total_price: return_request.UserOrder.final_price,
                reason: return_request.ReturnReason.return_reason_name,
                note: return_request.note,
                status: return_request.status_id,
                created_at: return_request.createdAt
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
                    return_type_id: return_type_id
                };

                const return_request_result = await getReturnRequest(payload);
                if (return_request_result.success) {
                    console.log("Return request result:", return_request_result.data);
                    setLocalState({ type: "SET_RETURN_REQUEST", payload: return_request_result.data });
                }
                else {
                    console.log("Return request error:", return_request_result.message);
                }
            }
        }
        fetchReturnRequest();
    }, [shop])


    return (
        <div className='rounded bg-white p-5'>
            <Table
                columns={column}
                dataSource={localState.data_source}
            />
        </div>
    )
}

export default ReturnOrderTable