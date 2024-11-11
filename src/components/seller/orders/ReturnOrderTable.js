import { Table } from 'antd'
import React, { useEffect, useReducer } from 'react'
import { useSelector } from 'react-redux';
import { getReturnRequest } from '../../../services/return_request_Service';

const ReturnOrderTable = ({ return_type_id }) => {
    const shop = useSelector(state => state.shop);


    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_VISIBLE_CONFIRM_ORDER_MODAL":
                    return { ...state, visible_confirm_order_modal: action.payload, };

                default:
                    return state;
            }
        },
        {
            visible_confirm_order_modal: false,

        }
    )


    const column = [
        {
            title: "Sản phẩm",
                        
        },
        {
            title: "Số tiền",

        },
        {
            title: "Lý do",

        },
        {
            title: "Ghi chú",

        },
        {
            title: "Trạng thái",
        },
        {
            title: "Ngày yêu cầu"
        }

    ]

    useEffect(() => {
        const fetchReturnRequest = async () => {
            if (shop) {
                const shop_id = shop.shop_id;
                const return_request_result = await getReturnRequest(shop_id, return_type_id);
                if (return_request_result.success) {
                    console.log("Return request result:", return_request_result.data);
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
            />
        </div>
    )
}

export default ReturnOrderTable