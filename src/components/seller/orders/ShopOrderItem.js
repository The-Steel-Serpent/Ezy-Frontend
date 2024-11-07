import { Avatar, Button, Image, List, Popover } from "antd";
import React, { memo } from "react";
import { CaretDownFilled, ShopFilled } from "@ant-design/icons";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { formatDate } from "date-fns";
import { useMessages } from "../../../providers/MessagesProvider";
import ShopOrderDetaiItem from "./ShopOrderDetaiItem";

const ShopOrderItem = (props) => {
    const { order } = props;
    const { handleUserSelected } = useMessages();
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
                                Đơn hàng mới cần được xác nhận.
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
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Hủy Đơn Hàng
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
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 2 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Hủy Đơn Hàng
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
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 3 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Hủy Đơn Hàng
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
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 4 && (
                            <div className="w-[60%] flex gap-3 justify-end">
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
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                        {order?.OrderStatus?.order_status_id === 5 && (
                            <div className="w-[100%] flex gap-3 justify-end">
                                <Button
                                    size="large"
                                    className="bg-secondary border-secondary text-white hover:opacity-80"
                                >
                                    Trả Hàng/Hoàn Tiền
                                </Button>
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
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
                                <Button
                                    className="bg-white text-primary hover:opacity-80"
                                    size="large"
                                >
                                    Chi Tiết Đơn Hàng
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(ShopOrderItem);
