/* eslint-disable jsx-a11y/alt-text */
import React, { memo, useCallback, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallet } from "../../redux/walletSlice";
import EzyWhite from "../../assets/logo_goat.png";
import { BankOutlined } from "@ant-design/icons";
import { IoCardOutline, IoWallet } from "react-icons/io5";
import { BiSolidBank } from "react-icons/bi";
import { IoIosJournal } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import WalletHistoryModal from "./WalletHistoryModal";
import WalletDepositModal from "./WalletDepositModal";

const WalletSection = () => {
  const wallet = useSelector((state) => state.wallet.wallet);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_BALANCE": {
          return {
            ...state,
            balance: action.payload,
          };
        }

        case "SET_IS_HIDDEN": {
          return {
            ...state,
            isCurrentHidden: action.payload,
          };
        }
        case "SET_OPEN_WALLET_HISTORY_MODAL": {
          return {
            ...state,
            openWalletHistoryModal: action.payload,
          };
        }
        case "SET_OPEN_WALLET_DEPOSIT_MODAL": {
          return {
            ...state,
            openWalletDepositModal: action.payload,
          };
        }

        default:
          return state;
      }
    },
    {
      balance: 0,
      isCurrentHidden: true,
      openWalletHistoryModal: false,
      openWalletDepositModal: false,
    }
  );
  useEffect(() => {
    if (token) {
      dispatch(fetchWallet(token));
    }
  }, [token, dispatch]);
  const formatCurrency = (balance, isHidden) => {
    if (isHidden) {
      return "****";
    }
    return new Intl.NumberFormat("vi-VN").format(balance);
  };
  const handleHideCurrency = () => {
    setLocalState({
      type: "SET_IS_HIDDEN",
      payload: !localState.isCurrentHidden,
    });
  };
  const handleOpenHistoryWalletModal = useCallback(() => {
    setLocalState({
      type: "SET_OPEN_WALLET_HISTORY_MODAL",
      payload: true,
    });
  }, []);
  const handleOpenDepositWalletModal = useCallback(() => {
    setLocalState({
      type: "SET_OPEN_WALLET_DEPOSIT_MODAL",
      payload: true,
    });
  }, []);
  const handleCloseHistoryWalletModal = useCallback(() => {
    setLocalState({
      type: "SET_OPEN_WALLET_HISTORY_MODAL",
      payload: false,
    });
  }, []);
  const handleCloseDepositWalletModal = useCallback(() => {
    setLocalState({
      type: "SET_OPEN_WALLET_DEPOSIT_MODAL",
      payload: false,
    });
  }, []);
  return (
    <>
      <section className="w-full bg-white grid grid-cols-12 p-4">
        <section className="col-span-12">
          <h1 className="text-2xl font-semibold">Ví Ezy</h1>
          <p className="text-sm text-gray-500">
            Số dư ví của bạn sẽ hiển thị ở đây. Bạn có thể nạp tiền vào ví để sử
            dụng dễ dàng hơn.
          </p>
        </section>
        <section className="col-span-12">
          <div className="bg-custom-gradient w-full h-64 rounded-md p-5 relative">
            <div className="flex flex-col gap-3">
              <span className="text-white">Số dư hiện tại</span>
              <span className="text-white font-semibold text-2xl flex gap-3 items-center">
                <span>
                  {formatCurrency(
                    wallet?.balance || 0,
                    localState.isCurrentHidden
                  )}
                  <sup>đ</sup>
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => handleHideCurrency()}
                >
                  {localState.isCurrentHidden ? <FaEye /> : <FaEyeSlash />}
                </span>
              </span>
            </div>

            <div className="absolute right-8 bottom-[65px] flex items-center flex-col">
              <img src={EzyWhite} className="size-28" />
              <span className="text-white italic ">
                Ezy - Easy Peezy Lemon Squeezy
              </span>
            </div>
            <div className="w-full flex items-center gap-7 absolute bottom-5">
              <span
                className="text-base flex flex-col items-center text-white cursor-pointer hover:opacity-80"
                onClick={handleOpenDepositWalletModal}
              >
                <IoWallet className="text-3xl text-orange-500" /> Nạp tiền
              </span>
              <span className="text-base flex flex-col items-center text-white  cursor-pointer hover:opacity-80">
                <BiSolidBank className="text-3xl text-yellow-500" />
                <span
                  title="Rút Tiền ( Sắp Ra Mắt )"
                  className="w-[118px] text-ellipsis line-clamp-1"
                >
                  Rút Tiền ( Sắp ra mắt )
                </span>
              </span>
              <span
                className="text-base flex flex-col items-center text-white cursor-pointer hover:opacity-80"
                onClick={handleOpenHistoryWalletModal}
              >
                <IoIosJournal className="text-3xl text-red-400" /> Lịch sử giao
                dịch
              </span>
            </div>
          </div>
        </section>
      </section>
      <WalletHistoryModal
        walletId={wallet?.user_wallet_id}
        openWalletHistoryModal={localState.openWalletHistoryModal}
        handleCloseHistoryWalletModal={handleCloseHistoryWalletModal}
      />
      <WalletDepositModal
        walletId={wallet?.user_wallet_id}
        openWalletDepositModal={localState.openWalletDepositModal}
        handleCloseDepositWalletModal={handleCloseDepositWalletModal}
      />
    </>
  );
};

export default memo(WalletSection);
