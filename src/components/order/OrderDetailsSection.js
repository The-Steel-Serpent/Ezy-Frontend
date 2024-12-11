import React, { lazy, memo, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RxCaretLeft } from "react-icons/rx";
import {
  Avatar,
  Button,
  Divider,
  List,
  message,
  Modal,
  Popover,
  Radio,
  Spin,
  Steps,
} from "antd";
import { GrCopy } from "react-icons/gr";
import {
  buyOrderAgain,
  checkoutOrder,
  checkoutOrderEzyWallet,
  completeOrder,
  getOrderDetails,
} from "../../services/orderService";
import { CgNotes } from "react-icons/cg";

import { MdLocalShipping } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { HiInboxArrowDown } from "react-icons/hi2";
import { formatDate } from "date-fns";
import { forEach } from "lodash";
import { CaretDownFilled, ShopFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useMessages } from "../../providers/MessagesProvider";
import { fetchWallet } from "../../redux/walletSlice";
import { fetchMiniCartData } from "../../redux/cartSlice";
import ModalReview from "./ModalReview";
import ModalGetReview from "./ModalGetReview";
import ModalSendRequest from "./ModalSendRequest";
import ModalOTP from "../user/ModalOTP";

import { FaRegCircleQuestion } from "react-icons/fa6";
import withSuspenseNonFallback from "../../hooks/HOC/withSuspenseNonFallback";
import moment from "moment-timezone";
const vnpay = require("../../assets/vnpay.png");
const walletImg = require("../../assets/wallet.png");
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
const OrderDetailsItem = withSuspenseNonFallback(
  lazy(() => import("./OrderDetailsItem"))
);
const OrderDetailsSection = () => {
  const { order_id } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const wallet = useSelector((state) => state.wallet.wallet);
  const user = useSelector((state) => state.user);
  const { handleUserSelected } = useMessages();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_ORDER_DETAILS":
          return {
            ...state,
            orderDetails: action.payload,
          };
        case "SET_LOADING":
          return {
            ...state,
            loading: action.payload,
          };
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
        case "SET_SHOW_ALL_LOG":
          return { ...state, showAllLog: action.payload };
        default:
          return state;
      }
    },
    {
      orderDetails: null,
      loading: false,
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
      showAllLog: false,
    }
  );
  document.title = "Chi tiết đơn hàng";
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const handleCopyUserOrderId = () => {
    navigator.clipboard
      .writeText(order_id)
      .then(() => {
        message.success("Đã sao chép mã đơn hàng");
      })
      .catch(() => {
        message.error("Sao chép mã đơn hàng thất bại");
      });
  };

  const handleCheckoutWithVnpay = async () => {
    try {
      const res = await checkoutOrder(localState.orderDetails?.user_order_id);
      if (res.success) {
        window.location.href = res.paymentUrl;
      }
    } catch (error) {
      console.log("Error when checkout order", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại sau");
    }
  };
  const handleCheckoutWithWallet = async () => {
    try {
      const res = await checkoutOrderEzyWallet(
        localState.orderDetails?.user_order_id,
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

  const handleCheckoutOrder = async () => {
    setLocalState({ type: "SET_OPEN_MODAL_PAYMENT_METHOD", payload: true });
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
  const handleOnVerifyOTP = () => {
    setLocalState({ type: "verifyOTP", payload: true });
  };
  const handleCloseModalOTP = () => {
    setLocalState({ type: "SET_OPEN_MODAL_OTP", payload: false });
  };

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

  const handleOpenModalReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_REVIEW", payload: true });
  };

  const handleBuyAgain = async () => {
    try {
      const res = await buyOrderAgain(localState.orderDetails?.user_order_id);
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

  const handleCompleteOrder = async () => {
    try {
      const res = await completeOrder(localState.orderDetails?.user_order_id);
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

  const handleOpenModalGetReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_GET_REVIEW", payload: true });
  };

  const handleCloseModalReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_REVIEW", payload: false });
  };

  const handleCloseModalCheckout = () => {
    setLocalState({ type: "SET_OPEN_MODAL_PAYMENT_METHOD", payload: false });
    setLocalState({ type: "SET_LOADING", payload: false });
    setLocalState({ type: "SET_SELECTED_PAYMENT_METHOD", payload: 3 });
  };

  const handleCloseModalGetReview = () => {
    setLocalState({ type: "SET_OPEN_MODAL_GET_REVIEW", payload: false });
  };

  const onSubmitPayment = () => {
    setLocalState({ type: "SET_OPEN_MODAL_OTP", payload: true });
    console.log("onSubmitPayment");
    setLocalState({ type: "SET_LOADING", payload: true });
  };

  const onPaymentMethodChange = (e) => {
    setLocalState({
      type: "SET_SELECTED_PAYMENT_METHOD",
      payload: e.target.value,
    });
  };
  const formatCurrency = (balance) => {
    return new Intl.NumberFormat("vi-VN").format(balance);
  };
  const handleViewShop = () => {
    navigate(`/shop/${localState.orderDetails?.Shop?.UserAccount?.username}`);
  };

  useEffect(() => {
    if (token && localState.openModalPaymentMethod) {
      dispatch(fetchWallet(token));
    }
  }, [token, dispatch, localState.openModalPaymentMethod]);

  const fetchOrderDetails = async () => {
    setLocalState({ type: "SET_LOADING", payload: true });
    try {
      const response = await getOrderDetails(order_id);
      if (response.success) {
        setLocalState({
          type: "SET_ORDER_DETAILS",
          payload: response.order,
        });
      }
    } catch (error) {
      console.log("Error when fetchOrderDetails", error);
    } finally {
      setLocalState({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    if (order_id) {
      fetchOrderDetails();
    }
  }, [order_id]);

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

  const logReverse =
    (localState.orderDetails?.log &&
      localState.orderDetails?.log?.slice().reverse()) ||
    [];
  const visibleLogItem = localState.showAllLog
    ? logReverse
    : logReverse.slice(0, 3);

  console.log(
    moment.tz(
      localState.orderDetails?.return_expiration_date,
      "Asia/Ho_Chi_Minh"
    )
  );
  const currentDate = moment.tz(new Date(), "Asia/Ho_Chi_Minh");
  const returnDate = moment
    .tz(localState.orderDetails?.return_expiration_date, "UTC")
    .tz("Asia/Ho_Chi_Minh");

  return (
    <div className="w-full flex flex-col gap-1 mb-20">
      {localState.loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin />
        </div>
      ) : localState.orderDetails !== null ? (
        <>
          <div className="flex justify-between items-center p-5 rounded bg-white">
            <span
              className="flex items-center gap-2 text-lg capitalize cursor-pointer text-neutral-500"
              onClick={handleBack}
            >
              <RxCaretLeft />
              Trở lại
            </span>
            <div className="flex items-center gap-3">
              <span className="pr-3 border-r-[1px] border-black flex gap-2 items-center">
                Mã Đơn Hàng: {localState.orderDetails?.user_order_id}{" "}
                <GrCopy
                  className="text-primary cursor-pointer"
                  onClick={handleCopyUserOrderId}
                />
              </span>

              <span className="uppercase text-primary">
                {localState.orderDetails?.ghn_status
                  ? statusDescriptions[localState.orderDetails?.ghn_status]
                  : localState.orderDetails?.OrderStatus?.order_status_name}
              </span>
            </div>
          </div>
          {/* Lộ Trình của đơn*/}
          {(localState.orderDetails?.order_status_id === 1 ||
            localState.orderDetails?.order_status_id === 2 ||
            localState.orderDetails?.order_status_id === 3 ||
            localState.orderDetails?.order_status_id === 4 ||
            localState.orderDetails?.order_status_id === 5) && (
            <>
              <div className="bg-white p-5 rounded">
                <Steps
                  items={[
                    {
                      title: <span className="text-lg">Đặt Hàng</span>,
                      description: (
                        <span className="text-neutral-500">
                          {formatDate(
                            localState.orderDetails?.created_at,
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </span>
                      ),
                      status: "finish",
                      icon: <CgNotes className="text-3xl" />,
                    },
                    {
                      title: <span className="text-lg">Đã Giao Cho ĐVVC</span>,
                      description:
                        localState.orderDetails?.log &&
                        localState.orderDetails.log.find(
                          (item) => item.status === "picked"
                        ) &&
                        formatDate(
                          localState.orderDetails.log.find(
                            (item) => item.status === "picked"
                          )?.updated_date,
                          "dd/MM/yyyy HH:mm:ss"
                        ),
                      status:
                        localState.orderDetails?.log &&
                        localState.orderDetails.log.some(
                          (item) => item.status === "picked"
                        )
                          ? "finish"
                          : "wait",
                      icon: <MdLocalShipping className="text-4xl" />,
                    },
                    {
                      title: <span className="text-lg">Chờ Giao Hàng</span>,
                      description: "",
                      status:
                        localState.orderDetails.order_status_id === 4 ||
                        localState.orderDetails.order_status_id === 5
                          ? "finish"
                          : "wait",
                      icon: <HiInboxArrowDown className="text-3xl" />,
                    },
                    {
                      title: <span className="text-lg">Đánh Giá</span>,
                      description: "",
                      status:
                        localState.orderDetails.is_reviewed === 1
                          ? "finish"
                          : "wait",
                      icon: <FaRegStar className="text-3xl " />,
                    },
                  ]}
                />
              </div>
              <div className="bg-third p-5 rounded">
                <div className="flex justify-between items-center">
                  {/* Title*/}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    1 && (
                    <div className="text-[12px] w-[40%] text-neutral-500">
                      Đơn hàng của bạn chưa thanh toán. Vui lòng thanh toán để
                      tiếp tục. Bạn có 10 phút để hoàn tất thanh toán. Sau 10
                      phút, đơn hàng sẽ tự động hủy.
                    </div>
                  )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    2 && (
                    <div className="text-[12px] w-[40%] text-neutral-500">
                      Bạn có thể hủy đơn hàng trong vòng 24h sau khi đặt hàng.
                    </div>
                  )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    3 && (
                    <div className="text-[12px] w-[40%] text-neutral-500">
                      Đơn hàng sẽ được chuẩn bị và giao cho bạn trong thời gian
                      sớm nhất.
                    </div>
                  )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    4 && (
                    <div className="text-[12px] w-[40%] text-neutral-500">
                      Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được
                      giao đến bạn và sản phẩm nhận được không có vấn đề nào.
                    </div>
                  )}

                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    5 &&
                    localState.orderDetails.is_reviewed === 0 && (
                      <div className="text-[12px] w-[40%] text-neutral-500">
                        Đánh giá sản phẩm giúp người mua khác hiểu rõ hơn về sản
                        phẩm.
                      </div>
                    )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    5 &&
                    localState.orderDetails.is_reviewed === 1 && (
                      <div className="text-[12px] w-[40%] text-neutral-500">
                        Nếu hàng nhận được có vấn đề, bạn có thể gửi yêu cầu Trả
                        hàng/Hoàn tiền trước ngày{" "}
                        <span className="underline">
                          {formatDate(
                            localState.orderDetails?.return_expiration_date,
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </span>
                      </div>
                    )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    6 && (
                    <div className="text-[12px] w-[40%] text-neutral-500">
                      Đơn hàng đã bị hủy bởi{" "}
                      {localState.orderDetails?.is_canceled_by === 1
                        ? "Bạn"
                        : localState.orderDetails?.is_canceled_by === 2
                        ? "Người bán"
                        : "Hệ Thống"}
                      .
                    </div>
                  )}

                  {/* Button*/}

                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    1 && (
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
                          handleUserSelected(
                            localState.orderDetails.Shop.UserAccount.user_id
                          )
                        }
                      >
                        Liên Hệ Người Bán
                      </Button>
                    </div>
                  )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    2 && (
                    <div className="w-[100%] flex gap-3 justify-end">
                      <Button
                        size="large"
                        className="bg-primary text-white hover:opacity-80"
                        onClick={() =>
                          handleOpenModalSendRequest("cancel-request")
                        }
                      >
                        Hủy Đơn Hàng
                      </Button>
                      <Button
                        className="bg-white text-primary hover:opacity-80"
                        size="large"
                        onClick={() =>
                          handleUserSelected(
                            localState.orderDetails.Shop.UserAccount.user_id
                          )
                        }
                      >
                        Liên Hệ Người Bán
                      </Button>
                    </div>
                  )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    3 && (
                    <div className="w-[100%] flex gap-3 justify-end">
                      <Button
                        size="large"
                        className={
                          localState.orderDetails?.ghn_status !== "picked" &&
                          localState.orderDetails?.return_request_status ===
                            0 &&
                          "bg-primary text-white hover:opacity-80"
                        }
                        onClick={() =>
                          handleOpenModalSendRequest("cancel-request")
                        }
                        disabled={
                          localState.orderDetails?.ghn_status === "picked" ||
                          localState.orderDetails?.return_request_status ===
                            1 ||
                          localState.orderDetails?.return_request_status ===
                            2 ||
                          localState.orderDetails?.return_request_status === 3
                        }
                      >
                        {localState.orderDetails?.return_request_status === 0
                          ? "Yêu Cầu Hủy Đơn"
                          : localState.orderDetails?.return_request_status === 1
                          ? "Đã Gửi Yêu Cầu"
                          : localState.orderDetails?.return_request_status === 2
                          ? "Chận Nhận Yêu Cầu"
                          : "Từ Chối Yêu Cầu"}
                      </Button>
                      <Button
                        className="bg-white text-primary hover:opacity-80"
                        size="large"
                        onClick={() =>
                          handleUserSelected(
                            localState.orderDetails.Shop.UserAccount.user_id
                          )
                        }
                      >
                        Liên Hệ Người Bán
                      </Button>
                    </div>
                  )}
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    4 && (
                    <div className="w-[60%] flex gap-3 justify-end">
                      <Button
                        size="large"
                        className="bg-primary text-white hover:opacity-80"
                        disabled={
                          localState.orderDetails.ghn_status !== "delivered" ||
                          localState.orderDetails?.return_request_status === 1
                        }
                        onClick={() => handleOpenModalConfirm("complete-order")}
                      >
                        Đã Nhận Hàng
                      </Button>
                      {localState.orderDetails?.return_expiration_date &&
                        currentDate.isBefore(returnDate) && (
                          <Button
                            size="large"
                            className={
                              localState.orderDetails?.return_request_status ===
                                0 &&
                              "bg-secondary border-secondary text-white hover:opacity-80"
                            }
                            onClick={() =>
                              handleOpenModalSendRequest("refund-request")
                            }
                            disabled={
                              localState.orderDetails?.return_request_status ===
                                1 ||
                              localState.orderDetails?.return_request_status ===
                                2 ||
                              localState.orderDetails?.return_request_status ===
                                3 ||
                              !currentDate.isBefore(returnDate)
                            }
                          >
                            {localState.orderDetails?.return_request_status ===
                            0
                              ? "Yêu Cầu Trả Hàng"
                              : localState.orderDetails
                                  ?.return_request_status === 1
                              ? "Đã Gửi Yêu Cầu"
                              : localState.orderDetails
                                  ?.return_request_status === 2
                              ? "Chận Nhận Yêu Cầu"
                              : "Từ Chối Yêu Cầu"}
                          </Button>
                        )}

                      <Button
                        className="bg-white text-primary hover:opacity-80"
                        size="large"
                        onClick={() =>
                          handleUserSelected(
                            localState.orderDetails.Shop.UserAccount.user_id
                          )
                        }
                      >
                        Liên Hệ Người Bán
                      </Button>
                    </div>
                  )}

                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    5 && (
                    <div className="w-[100%] flex gap-3 justify-end">
                      <Button
                        size="large"
                        className={`${
                          localState.orderDetails?.is_reviewed !== 1
                            ? "bg-primary text-white hover:opacity-80"
                            : "bg-neutral-200"
                        }`}
                        onClick={handleOpenModalReview}
                        disabled={localState.orderDetails?.is_reviewed === 1}
                      >
                        {localState.orderDetails?.is_reviewed === 0
                          ? "Đánh Giá"
                          : "Đã Đánh Giá"}
                      </Button>

                      {localState.orderDetails?.return_expiration_date &&
                        currentDate.isBefore(returnDate) && (
                          <Button
                            size="large"
                            className={
                              localState.orderDetails?.return_request_status ===
                                0 &&
                              "bg-secondary border-secondary text-white hover:opacity-80"
                            }
                            onClick={() =>
                              handleOpenModalSendRequest("refund-request")
                            }
                            disabled={
                              localState.orderDetails?.return_request_status ===
                                1 ||
                              localState.orderDetails?.return_request_status ===
                                2 ||
                              localState.orderDetails?.return_request_status ===
                                3 ||
                              !currentDate.isBefore(returnDate)
                            }
                          >
                            {localState.orderDetails?.return_request_status ===
                            0
                              ? "Yêu Cầu Trả Hàng"
                              : localState.orderDetails
                                  ?.return_request_status === 1
                              ? "Đã Gửi Yêu Cầu"
                              : localState.orderDetails
                                  ?.return_request_status === 2
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
                                handleUserSelected(
                                  localState.orderDetails.Shop.UserAccount
                                    .user_id
                                )
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
                            {localState.orderDetails?.is_reviewed === 1 && (
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
                  {localState.orderDetails?.OrderStatus?.order_status_id ===
                    6 && (
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
                          handleUserSelected(
                            localState.orderDetails.Shop.UserAccount.user_id
                          )
                        }
                      >
                        Liên Hệ Người Bán
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* Lịch sử và địa chỉ đơn hàng*/}
          {localState.orderDetails?.order_status_id !== 6 &&
            localState.orderDetails?.order_status_id !== 7 &&
            localState.orderDetails?.log && (
              <div className="p-5 bg-white rounded relative">
                <div
                  className="top-0 absolute w-full h-[3px] -left-[1px]"
                  style={{
                    backgroundSize: "116px 3px",
                    backgroundPositionX: "-30px",
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px)",
                  }}
                ></div>
                <div className="text-lg font-semibold">Địa Chỉ Nhận Hàng</div>
                <div className="grid grid-cols-12 mt-2 gap-4">
                  <div className="col-span-5 flex flex-col gap-3 border-r-[1px]">
                    <span className="font-semibold text-neutral-500">
                      {localState.orderDetails.user_address_order_name}
                    </span>
                    <span className="text-sm">
                      {localState.orderDetails.user_address_order_phone_number}
                    </span>
                    <span className="text-sm">
                      {localState.orderDetails.user_address_string}
                    </span>
                  </div>
                  <div className="col-span-7">
                    <Steps
                      direction="vertical"
                      items={visibleLogItem.map((item) => {
                        return {
                          title: (
                            <span className="text-lg">
                              {statusDescriptions[item.status]}
                            </span>
                          ),
                          description: (
                            <span className="text-neutral-500">
                              {formatDate(
                                item.updated_date,
                                "dd/MM/yyyy HH:mm:ss"
                              )}
                            </span>
                          ),
                          status: "finish",
                        };
                      })}
                    />
                    {logReverse.length > 3 && (
                      <span
                        className="pl-12 text-blue-500 cursor-pointer"
                        onClick={() =>
                          setLocalState({
                            type: "SET_SHOW_ALL_LOG",
                            payload: !localState.showAllLog,
                          })
                        }
                      >
                        {localState.showAllLog ? "Thu gọn" : "Xem Thêm"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Trạng thái hủy đơn*/}
          {localState.orderDetails?.order_status_id === 6 && (
            <>
              <div className="rounded bg-third p-5 flex flex-col gap-1">
                <span className="text-lg text-primary">Đã Hủy Đơn Hàng</span>
                <span className="text-neutral-500">
                  vào{" "}
                  {formatDate(
                    localState.orderDetails?.updated_at,
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </span>
              </div>
              <div className="rounded bg-white p-5">
                Lý do:{" "}
                {
                  localState.orderDetails?.ReturnRequest?.ReturnReason
                    ?.return_reason_name
                }
              </div>
            </>
          )}
          {/* Trạng thái trả hàng/hoàn tiền */}
          {localState.orderDetails?.order_status_id === 7 && (
            <>
              <div className="rounded bg-third p-5 flex flex-col gap-1">
                <span className="text-lg text-primary">
                  Đã Hoàn Tiền <sup>đ</sup>
                  {formatCurrency(localState.orderDetails?.final_price)}
                </span>
                <span className="text-neutral-500">
                  vào Ví EzyPay ngày {""}
                  {formatDate(
                    localState.orderDetails?.updated_at,
                    "dd/MM/yyyy HH:mm:ss"
                  )}
                </span>
              </div>
              <div className="rounded bg-white p-5">
                Lý do:{" "}
                {
                  localState.orderDetails?.ReturnRequest?.ReturnReason
                    ?.return_reason_name
                }
              </div>
            </>
          )}

          {/* Thông tin đơn hàng*/}
          <div className="w-full bg-white rounded p-5">
            <div className="flex justify-between items-center border-b-[1px] pb-2">
              <div className="flex items-center gap-3 ">
                <Avatar
                  src={localState.orderDetails?.Shop?.logo_url}
                  size={40}
                />
                <span className="text-lg font-semibold">
                  {localState.orderDetails?.Shop?.shop_name}
                </span>
                <div
                  className="size-5 fill-primary cursor-pointer"
                  onClick={() =>
                    handleUserSelected(
                      localState.orderDetails?.Shop?.UserAccount?.user_id
                    )
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
              {localState.orderDetails?.updated_date && (
                <div className="">
                  <Popover
                    content={
                      <div>
                        <p className="">
                          Cập nhật mới nhất:{" "}
                          {formatDate(
                            localState.orderDetails?.updated_date,
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </p>
                      </div>
                    }
                  >
                    <FaRegCircleQuestion className="text-slate-500" />
                  </Popover>
                </div>
              )}
            </div>
            {localState.orderDetails?.UserOrderDetails?.length > 0 && (
              <List
                dataSource={localState.orderDetails?.UserOrderDetails}
                renderItem={(item) => (
                  <List.Item>
                    <OrderDetailsItem
                      item={item}
                      onViewItem={() =>
                        navigate(
                          `/product-details/${item.ProductVarient.product_id}`
                        )
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
          {/* Thông tin thanh toán*/}
          {localState.orderDetails?.PaymentMethod?.payment_method_id === 1 && (
            <div className="p-5 border-primary bg-third text-primary">
              Vui lòng thanh toán{" "}
              <span className="text-xl font-semibold">
                <sup>đ</sup>
                {formatCurrency(localState.orderDetails?.final_price)}{" "}
              </span>{" "}
              khi nhận hàng.
            </div>
          )}
          {localState.orderDetails?.ReturnRequest !== null && (
            <table className="bg-white border-collapse">
              {localState.orderDetails?.order_status_id !== 6 &&
                localState.orderDetails?.order_status_id !== 7 && (
                  <>
                    <tr>
                      <td className="table-item">Tổng Tiền Hàng</td>
                      <td className="table-item">
                        <sup>đ</sup>
                        {formatCurrency(localState.orderDetails?.total_price)}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-item">Phí Vận Chuyển</td>
                      <td className="table-item">
                        {" "}
                        <sup>đ</sup>
                        {formatCurrency(localState.orderDetails?.shipping_fee)}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-item">Giảm giá phí vận chuyển</td>
                      <td className="table-item">
                        - <sup>đ</sup>
                        {formatCurrency(
                          localState.orderDetails?.discount_shipping_fee
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-item">Voucher từ Ezy</td>
                      <td className="table-item">
                        - <sup>đ</sup>
                        {formatCurrency(
                          localState.orderDetails?.discount_price
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="table-item">Thành Tiền</td>
                      <td className="table-item text-2xl text-primary">
                        <sup>đ</sup>
                        {formatCurrency(localState.orderDetails?.final_price)}
                      </td>
                    </tr>

                    <tr>
                      <td className="table-item">Phương Thức Thanh Toán</td>
                      <td className="table-item text-xl text-primary">
                        {
                          localState.orderDetails?.PaymentMethod
                            ?.payment_method_name
                        }
                      </td>
                    </tr>
                  </>
                )}

              {(localState.orderDetails?.order_status_id === 6 ||
                localState.orderDetails?.order_status_id === 7) && (
                <>
                  <tr>
                    <td className="table-item">Yêu cầu bởi</td>
                    <td className="table-item">
                      {localState.orderDetails?.is_canceled_by === 1
                        ? "Bạn"
                        : localState.orderDetails?.is_canceled_by === 2
                        ? "Người bán"
                        : "Hệ Thống"}
                    </td>
                  </tr>
                  <tr>
                    <td className="table-item">Phương Thức Thanh Toán</td>
                    <td className="table-item text-xl text-primary">
                      {
                        localState.orderDetails?.PaymentMethod
                          ?.payment_method_name
                      }
                    </td>
                  </tr>
                  {(localState.orderDetails?.PaymentMethod
                    ?.payment_method_id === 3 ||
                    localState.orderDetails?.PaymentMethod
                      ?.payment_method_id === 4) && (
                    <>
                      <tr>
                        <td className="table-item">Số tiền hoàn lại</td>
                        <td className="table-item text-primary text-xl">
                          <sup>đ</sup>
                          {formatCurrency(localState.orderDetails?.final_price)}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-item">Hoàn tiền vào</td>
                        <td className="table-item">Ví EzyPay</td>
                      </tr>
                    </>
                  )}
                </>
              )}
            </table>
          )}

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
                  disabled={
                    item?.balance < localState.orderDetails?.final_price && true
                  }
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
                    localState.modal.type === "complete-order"
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
              {localState.modal.type === "complete-order" &&
                'Ezy Sẽ thanh toán số tiền trên cho Người bán. Bạn vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề nào.'}
            </div>
          </Modal>

          {/* Modal Review */}
          <ModalReview
            orders={localState.orderDetails}
            openModalReview={localState.openModalReview}
            onCloseModalReview={handleCloseModalReview}
            onUpdateOrder={fetchOrderDetails}
          />
          <ModalGetReview
            orders={localState.orderDetails}
            openModalGetReview={localState.openModalGetReview}
            onCloseModalGetReview={handleCloseModalGetReview}
          />
          <ModalSendRequest
            order={localState.orderDetails}
            type={localState.modalSendRequest.type}
            openModalSendRequest={
              localState.modalSendRequest.openModalSendRequest
            }
            onCloseModalSendRequest={handleCloseModalSendRequest}
            onUpdateOrder={fetchOrderDetails}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center p-5 rounded bg-white">
            <span
              className="flex items-center gap-2 text-lg capitalize cursor-pointer text-neutral-500"
              onClick={handleBack}
            >
              <RxCaretLeft />
              Trở lại
            </span>
          </div>
          <div className="flex justify-center items-center h-[300px] flex-col gap-3">
            <CgNotes className="text-[40px] text-primary" />
            <span>Không tìm thấy đơn hàng</span>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(OrderDetailsSection);
