import { Avatar, Button, Image, List, message, notification, Popconfirm, Popover } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { CaretDownFilled, ShopFilled } from "@ant-design/icons";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { formatDate } from "date-fns";
import { useMessages } from "../../../providers/MessagesProvider";
import ShopOrderDetaiItem from "./ShopOrderDetaiItem";
import ConfirmOrderModal from "./ConfirmOrderModal";
import DetailOrderModal from "./DetailOrderModal";
import { redeliveryOrder, shopCancelOrder } from "../../../services/orderService";
import { getDistricts, getProvinces, getWards } from "../../../services/ghnService";
import { createNotification } from "../../../services/notificationsService";

const ShopOrderItem = (props) => {
    const { order } = props;
    const { handleUserSelected } = useMessages();

    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case "SET_VISIBLE_CONFIRM_ORDER_MODAL":
                    return { ...state, visible_confirm_order_modal: action.payload, };
                case "SET_VISIBLE_DETAIL_ORDER_MODAL":
                    return { ...state, visible_detail_order_modal: action.payload, };
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
                case 'SET_COUNT_DELIVERY_FAIL':
                    return { ...state, count_delivery_fail: action.payload };
                default:
                    return state;
            }
        },
        {
            visible_confirm_order_modal: false,
            visible_detail_order_modal: false,
            from_province_name: "",
            from_district_name: "",
            from_ward_name: "",
            required_note: "CHOTHUHANG",
            confirm_loading: false,
            count_delivery_fail: 0,
        }
    );

    const handleReLoad = () => {
        window.location.reload();
    }


    const statusDescriptions = {
        ready_to_pick: "Người bán đang chuẩn bị hàng",
        picking: "Đang lấy hàng",
        cancel: "Hủy đơn hàng",
        money_collect_picking: "Đang thu tiền người gửi",
        picked: "Đã lấy hàng",
        storing: "Hàng đang nằm ở kho",
        transporting: "Đang luân chuyển hàng",
        sorting: "Đang phân loại hàng hóa",
        delivering: "Nhân viên đang giao cho người nhận",
        money_collect_delivering: "Nhân viên đang thu tiền người nhận",
        delivered: "Giao hàng thành công",
        delivery_fail: "Giao hàng thất bại",
        waiting_to_return: "Đang đợi trả hàng về cho người gửi",
        return: "Trả hàng",
        return_transporting: "Đang luân chuyển hàng trả",
        return_sorting: "Đang phân loại hàng trả",
        returning: "Nhân viên đang đi trả hàng",
        return_fail: "Nhân viên trả hàng thất bại",
        returned: "Nhân viên trả hàng thành công",
        exception: "Đơn hàng ngoại lệ không nằm trong quy trình",
        damage: "Hàng bị hư hỏng",
        lost: "Hàng bị mất",
    };


    const statusEnableReturn = [
        "ready_to_pick",
        "picking",
        "money_collect_picking",
        "picked",
        "storing",
        "transporting",
        "sorting",
        "delivering",
        "transporting",
        "transporting",
        "delivery_fail",
    ]

    const handleCancelOrder = async () => {
        const payload = {
            user_order_id: order.user_order_id,
            shop_id: order.shop_id,
            order_codes: [order.order_code],
        }

        console.log("payload", payload);

        const response = await shopCancelOrder(payload);
        if (response.success) {
            message.info("Đơn hàng đã được hủy thành công");
            setTimeout(() => {
                handleReLoad();
            }, 1200);
        }
        else {
            message.error("Hủy đơn hàng thất bại");
            console.log("Error cancle order", response);
        }
    }

    const handleReDeliverOrder = async () => {
        setLocalState({ type: "SET_CONFIRM_LOADING", payload: true });
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
            required_note: localState.required_note, // required_note: "CHOTHUHANG, CHOXEMHANGKHONGTHU, KHONGCHOXEMHANG",
            from_name: order.Shop.full_name, // required
            from_phone: order.Shop.phone_number, // required
            from_address: order.Shop.shop_address, // required
            from_ward_name: localState.from_ward_name, // required
            from_district_name: localState.from_district_name, // required
            from_province_name: localState.from_province_name, // required
            to_name: order.UserAccount.full_name, // required
            to_phone: order.UserAccount.phone_number, // required
            to_address: order.user_address_string, // required
            to_ward_code: to_ward_code, // required !!!!!!
            to_district_id: to_district_id, // required !!!!!!!!
            weight: sum_weight, // required 
            length: sum_length, // required
            width: sum_width, // required 
            height: sum_height, // required
            service_type_id: service_type_id, // required !!!!!!!!
            items: items,
        }

        const redeliveryResult = await redeliveryOrder(payload);
        if (redeliveryResult.success) {
            message.info("Đơn hàng sẽ được giao lại trong thời gian sớm nhất");
            const noti_payload = {
                user_id: order.UserAccount.user_id,
                notifications_type: "Đơn hàng",
                title: "Đơn hàng sẽ được giao lại",
                content: `Đơn hàng của bạn sẽ được giao lại trong thời gian sớm nhất`,
                thumbnail: "https://res.cloudinary.com/dhzjvbdnu/image/upload/v1731496563/hyddw7hk56lrjefuteoh.png",
            }
            const noti_res = await createNotification(noti_payload);
            if (noti_res.success) {
                console.log("Create notification success", noti_res);
            }
            else {
                console.log("Create notification failed", noti_res);
            }
            setTimeout(() => {
                handleReLoad();
            }, 1200);
        }
        else {
            message.error("Giao hàng lại thất bại");
            console.log("Error redelivery order", redeliveryResult);
            console.log("payload", payload);
        }
        setLocalState({ type: "SET_CONFIRM_LOADING", payload: false });
    }

    useEffect(() => {
        if (order) {
            console.log("order neeee", order);
            if(order.log != null) {
                const count_delivery_fail = order.log.filter(log => log.status === "delivery_fail").length;
                setLocalState({ type: "SET_COUNT_DELIVERY_FAIL", payload: count_delivery_fail });
                console.log("count_delivery_fail", count_delivery_fail);
            }
           
        }
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

                        setLocalState({ type: "SET_FROM_PROVINCE_NAME", payload: shop_province?.ProvinceName || "" });
                        setLocalState({ type: "SET_FROM_DISTRICT_NAME", payload: shop_district?.DistrictName || "" });
                        setLocalState({ type: "SET_FROM_WARD_NAME", payload: shop_ward?.WardName || "" });
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
        <>
            <div className="mb-5">
                <div className="w-full bg-white px-5 py-4 rounded">
                    <div className="flex justify-between items-center border-b-[1px] pb-2">
                        <div className="flex items-center gap-3 ">
                            <Avatar src={order?.UserAccount?.avt_url} size={40} />
                            <span className="text-lg font-semibold">
                                {order?.UserAccount?.full_name}
                            </span>
                            <div
                                className="size-5 fill-primary cursor-pointer"
                                onClick={() =>
                                    handleUserSelected(order?.UserAccount?.user_id)
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path>
                                </svg>
                            </div>
                            {/* <Button size="small" onClick={handleViewShop}>
                                <ShopFilled /> Xem Shop
                            </Button> */}
                        </div>
                        <div className="flex gap-2">
                            {order?.ghn_status && (
                                <>
                                    <span className="text-secondary pr-2 border-r-[1px] flex gap-2">
                                        {statusDescriptions[order?.ghn_status]}
                                        <Popover
                                            content={
                                                <div>
                                                    <p className="">
                                                        Cập nhật mới nhất:{" "}
                                                        {formatDate(
                                                            order?.updated_date,
                                                            "dd/MM/yyyy HH:mm:ss"
                                                        )}
                                                    </p>
                                                </div>
                                            }
                                        >
                                            <FaRegCircleQuestion />
                                        </Popover>
                                    </span>
                                </>
                            )}
                            <span className="text-primary uppercase">
                                {order.OrderStatus.order_status_name}
                            </span>
                        </div>
                    </div>
                    {order?.UserOrderDetails?.length > 0 && (
                        <List
                            dataSource={order?.UserOrderDetails}
                            renderItem={(item) => (
                                <List.Item>
                                    <ShopOrderDetaiItem item={item} />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
                <div className="w-full bg-third rounded flex flex-col px-5 py-4">
                    <div className="w-full flex justify-end items-center py-5  gap-3">
                        <span className="text-sm">Thành Tiền:</span>
                        <span className="text-2xl font-semibold text-primary">
                            <sup>đ</sup>
                            {order.total_price.toLocaleString("vi-vn")}
                        </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        {/** Order Status */}
                        {order?.OrderStatus?.order_status_id === 1 && (
                            <div className="text-[12px] w-[40%] text-neutral-500">
                                Đơn hàng đang chờ người mua thanh toán.
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 2 && (
                            <div className="text-[12px] w-[40%] text-neutral-500">
                                Chuẩn bị hàng để giao cho đơn vị vận chuyển.
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 3 && (
                            <div className="text-[12px] w-[40%] text-neutral-500">
                                Đơn hàng đã được chuẩn bị và đang chờ đơn vị vận chuyển lấy hàng.
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 4 && (
                            <div className="text-[12px] w-[40%] text-neutral-500">
                                Đơn vị vận chuyển đã lấy hàng và đang vận chuyển đến người mua.
                            </div>
                        )}

                        {order?.OrderStatus?.order_status_id === 5 && (
                            <div className="text-[12px] w-[40%] text-neutral-500">
                                Đon hàng đã được giao thành công.
                            </div>
                        )}

                        {/** Button*/}
                        {order?.OrderStatus?.order_status_id === 1 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Popconfirm
                                    description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                    onConfirm={handleCancelOrder}
                                >
                                    <Button
                                        className="bg-white text-primary hover:opacity-80"
                                        size="large"
                                    >
                                        Hủy Đơn Hàng
                                    </Button>
                                </Popconfirm>


                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() =>
                                        handleUserSelected(order.UserAccount.user_id)
                                    }
                                >
                                    Liên Hệ Người Mua
                                </Button>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: true })}
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 2 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Popconfirm
                                    description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                    onConfirm={handleCancelOrder}
                                >
                                    <Button
                                        className="bg-white text-primary hover:opacity-80"
                                        size="large"
                                    >
                                        Hủy Đơn Hàng
                                    </Button>
                                </Popconfirm>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() =>
                                        handleUserSelected(order.UserAccount.user_id)
                                    }
                                >
                                    Liên Hệ Người Mua
                                </Button>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: true })}
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                                <Button
                                    className="bg-primary text-white hover:opacity-80"
                                    size="large"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_CONFIRM_ORDER_MODAL", payload: true })}
                                >
                                    Xác nhận đơn hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 3 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                {statusEnableReturn.includes(order?.ghn_status) && (
                                    <Popconfirm
                                        description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                        onConfirm={handleCancelOrder}
                                    >
                                        <Button
                                            className="bg-white text-primary hover:opacity-80"
                                            size="large"
                                        >
                                            Hủy Đơn Hàng
                                        </Button>
                                    </Popconfirm>
                                )}
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() =>
                                        handleUserSelected(order.UserAccount.user_id)
                                    }
                                >
                                    Liên Hệ Người Mua
                                </Button>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: true })}
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 4 && (
                            <div className="w-[60%] flex gap-3 justify-end">
                                {statusEnableReturn.includes(order?.ghn_status) && (
                                    <Popconfirm
                                        description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                        onConfirm={handleCancelOrder}
                                    >
                                        <Button
                                            className="bg-white text-primary hover:opacity-80"
                                            size="large"
                                        >
                                            Hủy Đơn Hàng
                                        </Button>
                                    </Popconfirm>
                                )}
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() =>
                                        handleUserSelected(order.UserAccount.user_id)
                                    }
                                >
                                    Liên Hệ Người Mua
                                </Button>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: true })}
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                                {/* {order?.ghn_status === "returned" && localState.count_delivery_fail < 4 && (
                                    <Popconfirm
                                        description="Bạn có chắc chắn muốn giao lại đơn hàng này không?"
                                        onConfirm={handleReDeliverOrder}
                                        loading={localState.confirm_loading}
                                        key={'confirm'}
                                    >
                                        <Button
                                            className="bg-white text-primary hover:opacity-80"
                                            size="large"
                                            loading={localState.confirm_loading}
                                        >
                                            Giao hàng lại
                                        </Button>
                                    </Popconfirm>
                                )} */}
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 5 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: true })}
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 6 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Button
                                    size="large"
                                    className="bg-white text-primary hover:opacity-80"
                                    onClick={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: true })}
                                >
                                    Xem Chi Tiết Đơn Hủy
                                </Button>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                    onClick={() =>
                                        handleUserSelected(order.UserAccount.user_id)
                                    }
                                >
                                    Liên Hệ Người Mua
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmOrderModal
                    visible={localState.visible_confirm_order_modal}
                    onCancel={() => setLocalState({ type: "SET_VISIBLE_CONFIRM_ORDER_MODAL", payload: false })}
                    order={order}
                    handleReLoad={handleReLoad}
                />

                <DetailOrderModal
                    visible={localState.visible_detail_order_modal}
                    onCancel={() => setLocalState({ type: "SET_VISIBLE_DETAIL_ORDER_MODAL", payload: false })}
                    order={order}
                />
            </div>
        </>
    );
};

export default memo(ShopOrderItem);
