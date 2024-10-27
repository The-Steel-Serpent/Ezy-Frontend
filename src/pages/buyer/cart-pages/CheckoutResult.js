import { Button, Result } from "antd";
import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loading":
          return { ...state, loading: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
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
        console.log(url);
        const res = await axios.get(url);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };

    if (
      vnp_Amount &&
      vnp_BankCode &&
      vnp_BankTranNo &&
      vnp_CardType &&
      vnp_OrderInfo &&
      vnp_PayDate &&
      vnp_ResponseCode &&
      vnp_TmnCode &&
      vnp_TransactionNo &&
      vnp_TransactionStatus &&
      vnp_TxnRef &&
      vnp_SecureHash
    ) {
      updateOrder();
    }
  }, [
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
  ]);

  return (
    <>
      <div className="">
        <Result
          status={"success"}
          title="Đặt Hàng Thành Công!"
          subTitle={"Cảm ơn bạn đã ủng hộ"}
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
    </>
  );
};

export default CheckoutResult;
