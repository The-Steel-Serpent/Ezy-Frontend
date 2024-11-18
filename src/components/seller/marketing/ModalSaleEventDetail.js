import { Button, message, Modal, Popconfirm } from 'antd'
import React, { useEffect, useReducer } from 'react'
import VoucherItemShop from './VoucherItemShop'
import { Image } from 'antd'
import { checkShopRegistedEvent, shopRegisterSaleEvent, unSubscribeSaleEvent } from '../../../services/saleEventService'
import { useSelector } from 'react-redux'
const ModalSaleEventDetail = (props) => {

    const initialState = {
        registed: false,
        loading: false,
        success: false
    };

    const shop = useSelector((state) => state.shop);
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_REGISTED':
                    return { ...state, registed: action.payload };
                case 'RESET_STATE':
                    return initialState;
                case 'SET_LOADING':
                    return { ...state, loading: action.payload };
                case 'SET_SUCCESS':
                    return { ...state, success: action.payload };
                default:
                    return state;
            }
        },
        initialState
    )

    const handleCheckRegisted = async (shop_id, sale_events_id) => {
        const payload = {
            shop_id: shop_id,
            sale_events_id: sale_events_id
        }
        const res = await checkShopRegistedEvent(payload);
        if (res.success) {
            setLocalState({ type: 'SET_REGISTED', payload: true })
        }
        else {
            setLocalState({ type: 'SET_REGISTED', payload: false })
        }
    }

    const handleRegisterSaleEvent = async (shop_id, sale_events_id) => {
        setLocalState({ type: 'SET_LOADING', payload: true })
        const payload = {
            shop_id: shop_id,
            sale_events_id: sale_events_id
        }
        try {
            const res = await shopRegisterSaleEvent(payload);
            if (res.success) {
                message.success("Đăng ký sự kiện thành công");
                setLocalState({ type: 'SET_SUCCESS', payload: true });
                setLocalState({ type: 'SET_REGISTED', payload: true });
            } else {
                console.error("Error registering sale event:", res.message);
                message.error(res.message);
                setLocalState({ type: 'SET_SUCCESS', payload: false });
            }
        } catch (error) {
            console.error("Error registering sale event:", error);
            message.error("Đăng ký sự kiện thất bại");
        }
        setLocalState({ type: "SET_LOADING", payload: false });
    }

    const handleUnSubscribeSaleEvent = async (shop_id, sale_events_id) => {
        setLocalState({ type: 'SET_LOADING', payload: true })
        const payload = {
            shop_id: shop_id,
            sale_events_id: sale_events_id
        }
        try {
            const res = await unSubscribeSaleEvent(payload);
            if (res.success) {
                message.success("Hủy đăng kí sự kiện thành công");
                setLocalState({ type: 'SET_SUCCESS', payload: true });
                setLocalState({ type: 'SET_REGISTED', payload: false });

            } else {
                console.error("Error unsubscibe sale event:", res.message);
                message.error(res.message);
                setLocalState({ type: 'SET_SUCCESS', payload: false });
            }
        } catch (error) {
            console.error("Error unsubscibe sale event:", error);
            message.error("Hủy đăng ký sự kiện thất bại");
        }
        setLocalState({ type: "SET_LOADING", payload: false });
    }

    useEffect(() => {
        console.log(props.sale_event)
        if (props.sale_event) {
            handleCheckRegisted(shop?.shop_id, props?.sale_event?.sale_events_id);
        }
    }, [
        props.visible,
        shop,
        localState.success
    ])
    return (
        <Modal
            title="Chi tiết khuyến mãi"
            open={props.visible}
            onCancel={props.onCancel}
            footer={null}
            centered={true}
        >
            <div>
                <h3 className="text-lg font-semibold">Danh sách voucher</h3>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {
                        props?.sale_event?.DiscountVouchers.map((item, index) => {
                            return <VoucherItemShop item={item} key={index} />
                        })
                    }
                </div>
                <h3 className="text-lg font-semibold">Danh sách danh mục được khuyến mãi</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                    {
                        props?.sale_event?.SaleEventsOnCategories.map((item, index) => {
                            return (
                                <div key={index} className="flex gap-3 items-center">
                                    <Image src={item?.Category?.thumbnail} width={50} height={50} className="rounded-md shadow" />
                                    <div>{item?.Category?.category_name}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='flex justify-end mt-5'>
                    {
                        localState.registed ? (
                            <Popconfirm
                                description="Bạn có chắc muốn hủy đăng kí sự kiện này không ?"
                                onConfirm={() => handleUnSubscribeSaleEvent(shop?.shop_id, props?.sale_event?.sale_events_id)}
                                loading={localState.loading}
                            >
                                <Button className='bg-red-600 border-none text-white'>Hủy đăng kí</Button>
                            </Popconfirm>
                        ) : (
                            <Popconfirm
                                description="Bạn có chắc muốn đăng kí sự kiện này cho cửa hàng không ?"
                                onConfirm={() => handleRegisterSaleEvent(shop?.shop_id, props?.sale_event?.sale_events_id)}
                                loading={localState.loading}
                            >
                                <Button className='bg-green-500 border-none text-white'>Đăng kí</Button>
                            </Popconfirm>
                        )
                    }
                </div>
            </div>
        </Modal>
    )
}

export default ModalSaleEventDetail