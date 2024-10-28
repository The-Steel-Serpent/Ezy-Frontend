import { Button, Result, Steps } from "antd";
import warning from "antd/es/_util/warning";
import axios from "axios";
import { is } from "date-fns/locale";
import React, { useEffect, useReducer } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { LuShoppingBag } from "react-icons/lu";
import { MdOutlinePayment } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { TbNotesOff } from "react-icons/tb";
import { FaSpinner } from "react-icons/fa6";

const CheckoutResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: action.payload };
        case "error":
          return { ...state, error: action.payload };
        case "success":
          return { ...state, success: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      error: {
        isError: false,
        message: "",
      },
      success: {
        isSuccess: false,
        message: "",
      },
      warning: {
        isWarning: false,
        message: "",
      },
    }
  );

  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);

  const vnp_Amount = queryParams.get("vnp_Amount");
  const vnp_BankCode = queryParams.get("vnp_BankCode");
  const vnp_BankTranNo = queryParams.get("vnp_BankTranNo");
  const vnp_CardType = queryParams.get("vnp_CardType");
  const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
  const vnp_PayDate = queryParams.get("vnp_PayDate");
  const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
  const vnp_TmnCode = queryParams.get("vnp_TmnCode");
  const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
  const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = queryParams.get("vnp_TxnRef");
  const vnp_SecureHash = queryParams.get("vnp_SecureHash");
  const status = queryParams.get("status");

  const { error, success, warning, loading } = localState;

  useEffect(() => {
    const updateOrder = async () => {
      try {
        setLocalState({ type: "loading", payload: true });
        const params = new URLSearchParams({
          vnp_Amount,
          vnp_BankCode,
          vnp_BankTranNo,
          vnp_CardType,
          vnp_OrderInfo,
          vnp_PayDate,
          vnp_ResponseCode,
          vnp_TmnCode,
          vnp_TransactionNo,
          vnp_TransactionStatus,
          vnp_TxnRef,
          vnp_SecureHash,
        });
        const url = `${
          process.env.REACT_APP_BACKEND_URL
        }/api/vnpay-ipn?${params.toString()}`;
        const res = await axios.get(url);
        if (res.data.status === "fail") {
          setLocalState({
            type: "error",
            payload: { isError: true, message: res.data.message },
          });
        } else if (res.data.status === "success") {
          setLocalState({
            type: "success",
            payload: { isSuccess: true, message: res.data.message },
          });
        } else {
          setLocalState({
            type: "warning",
            payload: { isWarning: true, message: res.data.message },
          });
        }
        setLocalState({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        setLocalState({
          type: "error",
          payload: { isError: true, message: error.message },
        });
      }
    };

    updateOrder();
  }, []);

  useEffect(() => {
    if (status !== "") {
      setLocalState({
        type: "success",
        payload: {
          isSuccess: status === "success",
          message:
            status === "success"
              ? "Thanh toán thành công"
              : "Thanh toán thất bại",
        },
      });
    }
  }, [status]);

  return (
    <>
      <section className="max-w-[1200px] mx-auto py-5">
        <div className="grid grid-cols-12 gap-7">
          <section className="col-span-12">
            <Steps
              className="flex justify-center"
              current={2}
              status={
                loading ? "process" : success.isSuccess ? "finish" : "error"
              }
              items={[
                {
                  title: (
                    <span className="text-lg font-semibold">Giỏ Hàng</span>
                  ),
                  icon: <LuShoppingBag size={32} />,
                },
                {
                  title: (
                    <span className="text-lg font-semibold">Thanh toán</span>
                  ),
                  icon: <MdOutlinePayment size={32} />,
                },
                {
                  title: (
                    <span className="text-lg font-semibold">
                      {loading
                        ? "Đang xử lý"
                        : success.isSuccess
                        ? "Đặt Hàng Thành Công"
                        : "Đặt Hàng Thất Bại"}
                    </span>
                  ),
                  icon: loading ? (
                    <FaSpinner />
                  ) : success.isSuccess ? (
                    <AiOutlineFileDone size={32} />
                  ) : (
                    <TbNotesOff size={32} />
                  ),
                },
              ]}
            />
          </section>

          <div className="col-span-12">
            <Result
              status={
                loading
                  ? "info"
                  : success.isSuccess
                  ? "success"
                  : error.isError
                  ? "error"
                  : "warning"
              }
              title={
                <span className="font-semibold text-3xl">
                  {loading
                    ? "Đang xử lý"
                    : success.isSuccess
                    ? "Thanh toán thành công"
                    : error.isError
                    ? "Thanh toán thất bại"
                    : "Có lỗi xảy ra"}
                </span>
              }
              subTitle={
                <span className="text-lg text-neutral-600">
                  {loading
                    ? "Vui lòng đợi trong giây lát"
                    : success.isSuccess
                    ? "Cảm ơn bạn đã ủng hộ Shop và Ezy. Đơn hàng sẽ được vận chuyển sớm đến bạn"
                    : error.isError
                    ? error.message
                    : warning.isWarning
                    ? warning.message
                    : "Có lỗi xảy ra"}
                </span>
              }
              extra={
                <Button
                  className="bg-primary text-white hover:opacity-80"
                  size="large"
                  onClick={() => navigate("/")}
                >
                  Trở về trang chủ
                </Button>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutResult;
