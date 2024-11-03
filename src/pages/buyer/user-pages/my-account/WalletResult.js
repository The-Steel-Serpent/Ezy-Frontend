import { Button, Result } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ipnHandler } from "../../../../services/walletService";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../../../../redux/walletSlice";

const WalletResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet.wallet);
  const token = localStorage.getItem("token");
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "loadingWallet":
          return { ...state, loadingWallet: action.payload };
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
      loadingWallet: false,
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

  const { error, success, warning, loading } = localState;
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        dispatch(fetchWallet(token));
      }
    };
    if (token) {
      fetchData().then(() => {
        setLocalState({ type: "loadingWallet", payload: true });
      });
    }
  }, [token, dispatch]);
  useEffect(() => {
    const updateWallet = async () => {
      try {
        setLocalState({ type: "loading", payload: true });
        const data = {
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
        };
        const res = await ipnHandler(wallet.user_wallet_id, data);
        console.log(res);
        if (res.status === "fail") {
          setLocalState({
            type: "error",
            payload: { isError: true, message: res.message },
          });
        } else if (res.status === "success") {
          setLocalState({
            type: "success",
            payload: { isSuccess: true, message: res.message },
          });
        } else {
          setLocalState({
            type: "warning",
            payload: { isWarning: true, message: res.message },
          });
        }
      } catch (error) {
        console.log(error);
        setLocalState({
          type: "error",
          payload: { isError: true, message: error.message },
        });
      } finally {
        setLocalState({ type: "loading", payload: false });
      }
    };

    if (wallet.user_wallet_id && localState.loadingWallet) {
      updateWallet();
    }
  }, [localState.loadingWallet, wallet]);

  return (
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
            ? "Nạp tiền thành công"
            : error.isError
            ? "Nạp tiền thất bại"
            : "Có lỗi xảy ra"}
        </span>
      }
      subTitle={
        <span className="text-lg text-neutral-600">
          {loading
            ? "Vui lòng đợi trong giây lát"
            : success.isSuccess
            ? "Đã nạp tiền vào ví thành công"
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
          onClick={() => navigate("/user/ezy-wallet")}
        >
          Trở về
        </Button>
      }
    />
  );
};

export default memo(WalletResult);
