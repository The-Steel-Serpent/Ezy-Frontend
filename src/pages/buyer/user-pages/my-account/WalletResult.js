import { Result } from "antd";
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

  const { error, success, warning, loading } = localState;
  useEffect(() => {
    if (token) {
      dispatch(fetchWallet(token));
    }
  }, [token, dispatch]);
  useEffect(() => {
    const updateWallet = async () => {
      try {
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
      } catch (error) {
        console.log(error);
      }
    };

    if (wallet.user_wallet_id) {
      console.log("wallet.user_wallet_id: ", wallet.user_wallet_id);
      updateWallet();
    }
  }, [wallet]);

  return <Result />;
};

export default memo(WalletResult);
