import { Button, message, Modal } from "antd";
import React, { memo, useReducer } from "react";
import NumericInput from "../input/NumericInput";
import { depositToWallet } from "../../services/walletService";
import { useNavigate } from "react-router-dom";
const WalletDepositModal = (props) => {
  const { walletId, openWalletDepositModal, handleCloseDepositWalletModal } =
    props;
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_AMOUNT": {
          return {
            ...state,
            amount: action.payload,
          };
        }
        case "SET_STATUS": {
          return {
            ...state,
            status: action.payload,
          };
        }
        default:
          return state;
      }
    },
    {
      amount: 0,
      status: "valid",
    }
  );
  const navigate = useNavigate();
  const handleAmountChange = (value) => {
    setLocalState({ type: "SET_AMOUNT", payload: value });
  };
  const handleDeposit = async () => {
    if (localState.amount < 60000) {
      setLocalState({ type: "SET_STATUS", payload: "error" });
      message.error("Số tiền nạp không được dưới 60,000đ");
      return;
    }
    if (localState.amount > 5000000) {
      setLocalState({ type: "SET_STATUS", payload: "error" });
      message.error("Số tiền nạp không được vượt quá 5,000,000đ");
      return;
    }
    try {
      const res = await depositToWallet(walletId, localState.amount);
      if (res.success) {
        window.location.href = res.paymentUrl;
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi nạp tiền vào ví");
    }
  };
  const handleCloseModal = () => {
    setLocalState({ type: "SET_AMOUNT", payload: 0 });
    setLocalState({ type: "SET_STATUS", payload: "valid" });
    handleCloseDepositWalletModal();
  };
  return (
    <Modal
      open={openWalletDepositModal}
      title={<span className="text-xl">Nạp Tiền Vào Ví Ezy</span>}
      onCancel={handleCloseModal}
      onClose={handleCloseModal}
      footer={
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            size="large"
            className=" hover:opacity-80"
            onClick={handleCloseModal}
          >
            Đóng
          </Button>
          <Button
            size="large"
            className="bg-primary text-white hover:opacity-80"
            onClick={handleDeposit}
          >
            Nạp Tiền
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <span className="text-base font-semibold">Số tiền cần nạp</span>
        <NumericInput
          status={localState.status}
          onChange={handleAmountChange}
          value={localState.amount}
          placeholder="Nhập vào số tiền"
        />
        <span className="text-sm font-semibold text-gray-400">
          Số tiền tối thiểu cần nạp là 60,000đ, số tiền tối đa cần nạp là
          5,000,000đ
        </span>
      </div>
    </Modal>
  );
};

export default memo(WalletDepositModal);
