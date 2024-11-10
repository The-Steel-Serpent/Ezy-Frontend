import {
  Avatar,
  Button,
  Image,
  List,
  message,
  Modal,
  Popover,
  Radio,
} from "antd";
import React, { lazy, memo, useEffect, useReducer } from "react";
import { useMessages } from "../../providers/MessagesProvider";
import { CaretDownFilled, ShopFilled } from "@ant-design/icons";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { formatDate } from "date-fns";
import {
  buyOrderAgain,
  cancelOrder,
  checkoutOrder,
  checkoutOrderEzyWallet,
  completeOrder,
} from "../../services/orderService";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../../redux/walletSlice";
import withSuspenseNonFallback from "../../hooks/HOC/withSuspenseNonFallback";
import { fetchMiniCartData } from "../../redux/cartSlice";

const ModalOTP = withSuspenseNonFallback(
  lazy(() => import("../user/ModalOTP"))
);
const ModalReview = withSuspenseNonFallback(
  lazy(() => import("./ModalReview"))
);
const ModalGetReview = withSuspenseNonFallback(
  lazy(() => import("./ModalGetReview"))
);
const ModalSendRequest = withSuspenseNonFallback(
  lazy(() => import("./ModalSendRequest"))
);
const OrderDetailsItem = withSuspenseNonFallback(
  lazy(() => import("./OrderDetailsItem"))
);
const vnpay = require("../../assets/vnpay.png");
const walletImg = require("../../assets/wallet.png");

const OrderItem = (props) => {
  const { order, onUpdateOrder } = props;
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const wallet = useSelector((state) => state.wallet.wallet);
  const user = useSelector((state) => state.user);
  const { handleUserSelected } = useMessages();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING": {
          return { ...state, loading: action.payload };
        }
        case "SET_ORDER_ITEM": {
          return { ...state, orderItem: action.payload };
        }
        case "SET_SELECTED_PAYMENT_METHOD": {
          return { ...state, selectedPaymentMethod: action.payload };
        }
        case "SET_OPEN_MODAL_PAYMENT_METHOD": {
          return { ...state, openModalPaymentMethod: action.payload };
        }
        case "SET_OPEN_MODAL_OTP": {
          return { ...state, openModalOTP: action.payload };
        }
        case "SET_MODAL": {
          return { ...state, modal: action.payload };
        }
        case "SET_OPEN_MODAL_REVIEW": {
          return { ...state, openModalReview: action.payload };
        }
        case "SET_OPEN_MODAL_GET_REVIEW": {
          return { ...state, openModalGetReview: action.payload };
        }
        case "SET_OPEN_MODAL_SEND_REQUEST": {
          return { ...state, modalSendRequest: action.payload };
        }
        case "verifyOTP":
          return { ...state, verifyOTP: action.payload };

        default:
          return state;
      }
    },
    {
      loading: false,
      orderItem: [],
      verifyOTP: false,
      selectedPaymentMethod: 3,
      openModalPaymentMethod: false,
      openModalOTP: false,
      openModalGetReview: false,
      modalSendRequest: {
        type: "",
        openModalSendRequest: false,
      },
      modal: {
        openModalConfirm: false,
        type: "",
      },
      openModalReview: false,
    }
  );
  // Effects
  useEffect(() => {
    if (token && localState.openModalPaymentMethod) {
      dispatch(fetchWallet(token));
    }
  }, [token, dispatch, localState.openModalPaymentMethod]);
  useEffect(() => {
    const checkout = async () => {
      if (localState.selectedPaymentMethod === 3) {
        await handleCheckoutWithVnpay();
      } else {
        await handleCheckoutWithWallet();
      }
    };
    if (localState.verifyOTP) {
      checkout();
    }
  }, [localState.verifyOTP]);
  useEffect(() => {
    setLocalState({ type: "SET_ORDER_ITEM", payload: order });
  }, [order]);
  // Handlers
  const handleViewShop = () => {
    window.location.href = `/shop/${order?.Shop?.UserAccount?.username}`;
  };
  const handleCheckoutOrder = async () => {
    setLocalState({ type: "SET_OPEN_MODAL_PAYMENT_METHOD", payload: true });
  };
  const handleCloseModalOTP = () => {
    setLocalState({ type: "SET_OPEN_MODAL_OTP", payload: false });
  };
  const handleCloseModalCheckout = () => {
    setLocalState({ type: "SET_OPEN_MODAL_PAYMENT_METHOD", payload: false });
    setLocalState({ type: "SET_LOADING", payload: false });
    setLocalState({ type: "SET_SELECTED_PAYMENT_METHOD", payload: 3 });
  };

  const handleOpenModalReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_REVIEW", payload: true });
  };
  const handleCloseModalReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_REVIEW", payload: false });
  };

  const handleOpenModalGetReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_GET_REVIEW", payload: true });
  };

  const handleCloseModalGetReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_GET_REVIEW", payload: false });
  };

  const handleOpenModalSendRequest = (type) => {
    setLocalState({
      type: "SET_OPEN_MODAL_SEND_REQUEST",
      payload: { type: type, openModalSendRequest: true },
    });
  };
  const handleCloseModalSendRequest = () => {
    setLocalState({
      type: "SET_OPEN_MODAL_SEND_REQUEST",
      payload: { type: "", openModalSendRequest: false },
    });
  };

  const handleCheckoutWithVnpay = async () => {
    try {
      const res = await checkoutOrder(order.user_order_id);
      if (res.success) {
        window.location.href = res.paymentUrl;
      }
    } catch (error) {
      console.log("Error when checkout order", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };
  const handleOnVerifyOTP = () => {
    setLocalState({ type: "verifyOTP", payload: true });
  };
  const handleCheckoutWithWallet = async () => {
    try {
      const res = await checkoutOrderEzyWallet(
        order.user_order_id,
        wallet.user_wallet_id
      );
      if (res.success) {
        message.success("Thanh toán thành công");
        setLocalState({
          type: "SET_OPEN_MODAL_PAYMENT_METHOD",
          payload: false,
        });
        setTimeout(
          () => (window.location.href = "/user/purchase?status-id=2"),
          2000
        );
      }
    } catch (error) {
      console.log("Error when checkout order", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };
  const onPaymentMethodChange = (e) => {
    setLocalState({
      type: "SET_SELECTED_PAYMENT_METHOD",
      payload: e.target.value,
    });
  };

  const onSubmitPayment = () => {
    setLocalState({ type: "SET_OPEN_MODAL_OTP", payload: true });
    console.log("onSubmitPayment");
    setLocalState({ type: "SET_LOADING", payload: true });
  };

  // Arrays
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

  const PaymentMethodArray = [
    {
      name: "Ví VNPay",
      value: 3,
      image: vnpay,
    },
    {
      name: "Ví EzyPay ",
      value: 4,
      image: walletImg,
      balance: wallet.balance,
    },
  ];

  const handleOpenModalConfirm = (type) => {
    setLocalState({
      type: "SET_MODAL",
      payload: { openModalConfirm: true, type: type },
    });
  };
  const handleCloseModalConfirm = () => {
    setLocalState({
      type: "SET_MODAL",
      payload: { openModalConfirm: false, type: "" },
    });
  };
  const formatCurrency = (balance) => {
    return new Intl.NumberFormat("vi-VN").format(balance) + "đ";
  };

  //Order Handlers
  const handleCancelOrder = async () => {
    try {
      const res = await cancelOrder(order.user_order_id, 1);
      if (res.success) {
        message.success("Hủy đơn hàng thành công");
        handleCloseModalConfirm();
        setTimeout(
          () => (window.location.href = "/user/purchase?status-id=6"),
          2000
        );
      }
    } catch (error) {
      console.log("Error when cancel order", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const res = await completeOrder(order.user_order_id);
      if (res.success) {
        message.success("Đã nhận hàng thành công");
        handleCloseModalConfirm();
        setTimeout(
          () => (window.location.href = "/user/purchase?status-id=5"),
          2000
        );
      }
    } catch (error) {
      console.log("Error when complete order", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };
  const handleBuyAgain = async () => {
    try {
      const res = await buyOrderAgain(order.user_order_id);
      if (res.success) {
        message.success("Thêm vào giỏ hàng thành công");
        dispatch(fetchMiniCartData(user?.user_id));
        setTimeout(() => (window.location.href = "/cart"), 2000);
      }
    } catch (error) {
      console.log("Error when buy again", error);
      message.error(error.message);
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="w-full bg-white px-5 py-4 rounded">
          <div className="flex justify-between items-center border-b-[1px] pb-2">
            <div className="flex items-center gap-3 ">
              <Avatar src={order?.Shop?.logo_url} size={40} />
              <span className="text-lg font-semibold">
                {order?.Shop?.shop_name}
              </span>
              <div
                className="size-5 fill-primary cursor-pointer"
                onClick={() =>
                  handleUserSelected(order?.Shop?.UserAccount?.user_id)
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M18 6.07a1 1 0 01.993.883L19 7.07v10.365a1 1 0 01-1.64.768l-1.6-1.333H6.42a1 1 0 01-.98-.8l-.016-.117-.149-1.783h9.292a1.8 1.8 0 001.776-1.508l.018-.154.494-6.438H18zm-2.78-4.5a1 1 0 011 1l-.003.077-.746 9.7a1 1 0 01-.997.923H4.24l-1.6 1.333a1 1 0 01-.5.222l-.14.01a1 1 0 01-.993-.883L1 13.835V2.57a1 1 0 011-1h13.22zm-4.638 5.082c-.223.222-.53.397-.903.526A4.61 4.61 0 018.2 7.42a4.61 4.61 0 01-1.48-.242c-.372-.129-.68-.304-.902-.526a.45.45 0 00-.636.636c.329.33.753.571 1.246.74A5.448 5.448 0 008.2 8.32c.51 0 1.126-.068 1.772-.291.493-.17.917-.412 1.246-.74a.45.45 0 00-.636-.637z"></path>
                </svg>
              </div>
              <Button size="small" onClick={handleViewShop}>
                <ShopFilled /> Xem Shop
              </Button>
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
                  <OrderDetailsItem item={item} />
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
              {order.final_price.toLocaleString("vi-vn")}
            </span>
          </div>
          <div className="flex justify-between items-center gap-2">
            {/** Order Status */}
            {order?.OrderStatus?.order_status_id === 1 && (
              <div className="text-[12px] w-[40%] text-neutral-500">
                Đơn hàng của bạn chưa thanh toán. Vui lòng thanh toán để tiếp
                tục
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 2 && (
              <div className="text-[12px] w-[40%] text-neutral-500">
                Bạn có thể hủy đơn hàng trong vòng 24h sau khi đặt hàng.
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 3 && (
              <div className="text-[12px] w-[40%] text-neutral-500">
                Đơn hàng sẽ được chuẩn bị và giao cho bạn trong thời gian sớm
                nhất.
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 4 && (
              <div className="text-[12px] w-[40%] text-neutral-500">
                Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
                đến bạn và sản phẩm nhận được không có vấn đề nào.
              </div>
            )}

            {order?.OrderStatus?.order_status_id === 5 && (
              <div className="text-[12px] w-[40%] text-neutral-500">
                Đánh giá sản phẩm giúp người mua khác hiểu rõ hơn về sản phẩm.
              </div>
            )}

            {/** Button*/}
            {order?.OrderStatus?.order_status_id === 1 && (
              <div className="w-[100%] flex gap-3 justify-end">
                <Button
                  size="large"
                  className="bg-primary text-white hover:opacity-80"
                  onClick={handleCheckoutOrder}
                >
                  Thanh Toán
                </Button>
                <Button
                  className="bg-white text-primary hover:opacity-80"
                  size="large"
                  onClick={() =>
                    handleUserSelected(order.Shop.UserAccount.user_id)
                  }
                >
                  Liên Hệ Người Bán
                </Button>
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 2 && (
              <div className="w-[100%] flex gap-3 justify-end">
                <Button
                  size="large"
                  className="bg-primary text-white hover:opacity-80"
                  onClick={() => handleOpenModalConfirm("cancel-order")}
                >
                  Hủy Đơn Hàng
                </Button>
                <Button
                  className="bg-white text-primary hover:opacity-80"
                  size="large"
                  onClick={() =>
                    handleUserSelected(order.Shop.UserAccount.user_id)
                  }
                >
                  Liên Hệ Người Bán
                </Button>
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 3 && (
              <div className="w-[100%] flex gap-3 justify-end">
                <Button
                  size="large"
                  className={
                    order?.ghn_status !== "picked" &&
                    order?.return_request_status === 0 &&
                    "bg-primary text-white hover:opacity-80"
                  }
                  onClick={() => handleOpenModalSendRequest("cancel-request")}
                  disabled={
                    order?.ghn_status === "picked" ||
                    order?.return_request_status === 1 ||
                    order?.return_request_status === 2 ||
                    order?.return_request_status === 3
                  }
                >
                  {order?.return_request_status === 0
                    ? "Yêu Cầu Hủy Đơn"
                    : order?.return_request_status === 1
                    ? "Đã Gửi Yêu Cầu"
                    : order?.return_request_status === 2
                    ? "Chận Nhận Yêu Cầu"
                    : "Từ Chối Yêu Cầu"}
                </Button>
                <Button
                  className="bg-white text-primary hover:opacity-80"
                  size="large"
                  onClick={() =>
                    handleUserSelected(order.Shop.UserAccount.user_id)
                  }
                >
                  Liên Hệ Người Bán
                </Button>
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 4 && (
              <div className="w-[60%] flex gap-3 justify-end">
                <Button
                  size="large"
                  className="bg-primary text-white hover:opacity-80"
                  disabled={
                    order.ghn_status !== "delivered" ||
                    order?.return_request_status === 1
                  }
                  onClick={() => handleOpenModalConfirm("complete-order")}
                >
                  Đã Nhận Hàng
                </Button>
                {order?.return_expiration_date &&
                  order?.return_expiration_date !== new Date() && (
                    <Button
                      size="large"
                      className={
                        order?.return_request_status === 0 &&
                        "bg-secondary border-secondary text-white hover:opacity-80"
                      }
                      onClick={() =>
                        handleOpenModalSendRequest("refund-request")
                      }
                      disabled={
                        order?.return_request_status === 1 ||
                        order?.return_request_status === 2 ||
                        order?.return_request_status === 3
                      }
                    >
                      {order?.return_request_status === 0
                        ? "Yêu Cầu Trả Hàng"
                        : order?.return_request_status === 1
                        ? "Đã Gửi Yêu Cầu"
                        : order?.return_request_status === 2
                        ? "Chận Nhận Yêu Cầu"
                        : "Từ Chối Yêu Cầu"}
                    </Button>
                  )}

                <Button
                  className="bg-white text-primary hover:opacity-80"
                  size="large"
                  onClick={() =>
                    handleUserSelected(order.Shop.UserAccount.user_id)
                  }
                >
                  Liên Hệ Người Bán
                </Button>
              </div>
            )}

            {order?.OrderStatus?.order_status_id === 5 && (
              <div className="w-[100%] flex gap-3 justify-end">
                <Button
                  size="large"
                  className={`${
                    order?.is_reviewed !== 1
                      ? "bg-primary text-white hover:opacity-80"
                      : "bg-neutral-200"
                  }`}
                  onClick={handleOpenModalReview}
                  disabled={order?.is_reviewed === 1}
                >
                  {order?.is_reviewed === 0 ? "Đánh Giá" : "Đã Đánh Giá"}
                </Button>

                {order?.return_expiration_date &&
                  order?.return_expiration_date !== new Date() && (
                    <Button
                      size="large"
                      className={
                        order?.return_request_status === 0 &&
                        "bg-secondary border-secondary text-white hover:opacity-80"
                      }
                      onClick={() =>
                        handleOpenModalSendRequest("refund-request")
                      }
                      disabled={
                        order?.return_request_status === 1 ||
                        order?.return_request_status === 2 ||
                        order?.return_request_status === 3
                      }
                    >
                      {order?.return_request_status === 0
                        ? "Yêu Cầu Trả Hàng"
                        : order?.return_request_status === 1
                        ? "Đã Gửi Yêu Cầu"
                        : order?.return_request_status === 2
                        ? "Chận Nhận Yêu Cầu"
                        : "Từ Chối Yêu Cầu"}
                    </Button>
                  )}

                <Popover
                  content={
                    <div className="flex flex-col">
                      <span
                        className="hover:bg-slate-100 cursor-pointer"
                        onClick={() =>
                          handleUserSelected(order.Shop.UserAccount.user_id)
                        }
                      >
                        Liên Hệ Người Bán
                      </span>
                      <span
                        className="hover:bg-slate-100 cursor-pointer"
                        onClick={handleBuyAgain}
                      >
                        Mua Lại
                      </span>
                      {order?.is_reviewed === 1 && (
                        <span
                          className="hover:bg-slate-100 cursor-pointer"
                          onClick={handleOpenModalGetReview}
                        >
                          Xem Đánh Giá
                        </span>
                      )}
                    </div>
                  }
                >
                  <Button
                    size="large"
                    className="bg-white text-primary hover:opacity-80"
                  >
                    Thêm <CaretDownFilled />
                  </Button>
                </Popover>
              </div>
            )}
            {order?.OrderStatus?.order_status_id === 6 && (
              <div className="w-[100%] flex gap-3 justify-end">
                <Button
                  size="large"
                  className="bg-primary text-white hover:opacity-80 w-[180px]"
                  onClick={handleBuyAgain}
                >
                  Mua Lại
                </Button>
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
                    handleUserSelected(order.Shop.UserAccount.user_id)
                  }
                >
                  Liên Hệ Người Bán
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Payment Method*/}
      <Modal
        open={localState.openModalPaymentMethod}
        title={<span className="text-lg">Phương Thức Thanh Toán</span>}
        onCancel={handleCloseModalCheckout}
        onClose={handleCloseModalCheckout}
        footer={
          <div className="w-full flex justify-end items-center gap-3">
            <Button
              size="large"
              className="border-secondary text-secondary bg-white hover:bg-secondary hover:text-white"
              onClick={handleCloseModalCheckout}
            >
              Hủy
            </Button>
            <Button
              size="large"
              className="bg-primary text-white hover:opacity-80"
              onClick={onSubmitPayment}
            >
              Xác Nhận
            </Button>
          </div>
        }
      >
        <Radio.Group
          className="flex flex-col gap-3"
          defaultValue={1}
          onChange={onPaymentMethodChange}
        >
          {PaymentMethodArray.map((item) => (
            <Radio
              value={item.value}
              disabled={item?.balance < order?.final_price && true}
            >
              <div className="w-full flex items-center gap-2">
                <img src={item.image} alt="" className="w-11" />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {item?.balance !== undefined && (
                    <span>Số dư: ({formatCurrency(item?.balance)})</span>
                  )}
                </div>
              </div>
            </Radio>
          ))}
        </Radio.Group>
      </Modal>

      {/* Modal OTP */}
      <ModalOTP
        onVerify={handleOnVerifyOTP}
        user={user}
        openOTPModal={localState.openModalOTP}
        handleCancelOTP={handleCloseModalOTP}
      />

      {/* Modal Confirm */}
      <Modal
        title={<span className="text-2xl">Thông Báo Xác Nhận</span>}
        open={localState.modal.openModalConfirm}
        onCancel={handleCloseModalConfirm}
        onClose={handleCloseModalConfirm}
        footer={
          <div className="w-full flex gap-3 justify-end items-center">
            <Button
              size="large"
              className="border-secondary text-secondary bg-white hover:bg-secondary hover:text-white"
              onClick={handleCloseModalConfirm}
            >
              Hủy
            </Button>
            <Button
              size="large"
              className="bg-primary text-white hover:opacity-80"
              onClick={
                localState.modal.type === "cancel-order"
                  ? handleCancelOrder
                  : localState.modal.type === "complete-order"
                  ? handleCompleteOrder
                  : null
              }
            >
              Xác Nhận
            </Button>
          </div>
        }
      >
        <div className="text-lg">
          {localState.modal.type === "cancel-order" &&
            "Bạn có chắc chắn muốn hủy đơn hàng này không?"}
          {localState.modal.type === "complete-order" &&
            'Ezy Sẽ thanh toán số tiền trên cho Người bán. Bạn vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề nào.'}
        </div>
      </Modal>

      {/* Modal Review */}
      <ModalReview
        orders={order}
        openModalReview={localState.openModalReview}
        onCloseModalReview={handleCloseModalReview}
        onUpdateOrder={onUpdateOrder}
      />
      <ModalGetReview
        orders={order}
        openModalGetReview={localState.openModalGetReview}
        onCloseModalGetReview={handleCloseModalGetReview}
      />
      <ModalSendRequest
        order={order}
        type={localState.modalSendRequest.type}
        openModalSendRequest={localState.modalSendRequest.openModalSendRequest}
        onCloseModalSendRequest={handleCloseModalSendRequest}
        onUpdateOrder={onUpdateOrder}
      />
    </>
  );
};

export default memo(OrderItem);
