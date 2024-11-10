import { Button, Modal, Radio } from "antd";
import React, { memo, useEffect, useReducer, useState } from "react";
import { useCheckout } from "../../providers/CheckoutProvider";
import { useDispatch, useSelector } from "react-redux";
import { VscError } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import ModalOTP from "../user/ModalOTP";
import { fetchWallet } from "../../redux/walletSlice";

const momo = require("../../assets/momo.png");
const vnpay = require("../../assets/vnpay.png");
const cod = require("../../assets/cod.png");
const walletImg = require("../../assets/wallet.png");

const PaymentMethodSection = (props) => {
  const { total, loading } = props;
  const token = localStorage.getItem("token");
  const {
    state,
    onPaymentMethodChange,
    handleCheckoutClick,
    handleCloseModalOTP,
    handleOnVerifyOTP,
  } = useCheckout();
  const user = useSelector((state) => state.user);
  const wallet = useSelector((state) => state.wallet.wallet);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    totalPayment,
    openModalCheckoutError,
    checkoutMessage,
    openModalOTP,
  } = state;
  const PaymentMethodArray = [
    {
      name: "Thanh Toán Khi Nhận Hàng",
      value: 1,
      image: cod,
      disabled: totalPayment?.final > 5000000 || totalPayment?.final === 0,
    },
    {
      name: "Ví VNPay",
      value: 3,
      image: vnpay,
      disabled: totalPayment?.final === 0,
    },
    {
      name: "Ví EzyPay ",
      value: 4,
      image: walletImg,
      balance: wallet.balance,
      disabled:
        wallet.balance < totalPayment?.final || totalPayment?.final === 0,
    },
  ];

  useEffect(() => {
    if (token) {
      dispatch(fetchWallet(token));
    }
  }, [token, dispatch]);
  const formatCurrency = (balance) => {
    return new Intl.NumberFormat("vi-VN").format(balance) + "đ";
  };
  return (
    <>
      <div className="w-full flex flex-col gap-10">
        <span className="text-lg font-semibold">Phương Thức Thanh Toán</span>
        <div className="grid grid-cols-12">
          <div className="col-span-5">
            <div className="w-full">
              <Radio.Group
                className="flex flex-col gap-3"
                defaultValue={1}
                onChange={onPaymentMethodChange}
              >
                {PaymentMethodArray.map((item) => (
                  <Radio value={item.value} disabled={item.disabled}>
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
            </div>
          </div>
          <div className="col-span-7 justify-end  flex flex-col gap-4">
            <div className="grid grid-cols-12 ">
              <div className="col-span-7 flex justify-end items-center text-neutral-600">
                Tổng Tiền Hàng
              </div>
              <div className="col-span-5  flex justify-end items-center text-neutral-600">
                <sup>đ</sup>
                {total?.totalPrice?.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-7  flex justify-end items-center text-neutral-600">
                Phí Vận Chuyển
              </div>
              <div className="col-span-5  flex justify-end items-center text-neutral-600">
                <sup>đ</sup>
                {total?.shippingFee?.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="grid grid-cols-12 ">
              <div className="col-span-7  flex justify-end items-center text-neutral-600">
                Giảm giá phí vận chuyển
              </div>
              <div className="col-span-5  flex justify-end items-center text-neutral-600">
                -<sup>đ</sup>
                {total?.discountShippingFee?.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-7  flex justify-end items-center text-neutral-600">
                Voucher từ Ezy
              </div>
              <div className="col-span-5  flex justify-end items-center text-neutral-600">
                -<sup>đ</sup>
                {total?.discountPrice?.toLocaleString("vi-VN")}
              </div>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-7  flex justify-end items-center font-semibold text-neutral-900">
                Thành Tiền
              </div>
              <div className="col-span-5  flex justify-end items-center text-2xl text-primary">
                <sup>đ</sup>
                {total?.final?.toLocaleString("vi-VN")}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end items-center gap-3">
          <Button
            className="w-[160px] h-[45px] text-lg bg-white text-primary border-primary hover:bg-primary hover:text-white"
            onClick={() => navigate("/cart")}
          >
            Trở Lại
          </Button>
          <Button
            disabled={loading}
            className={`w-[160px] h-[45px] text-lg bg-primary text-white hover:opacity-80 ${
              total?.final === 0 && "disabled"
            }`}
            onClick={() => !loading && handleCheckoutClick(user?.user_id)}
          >
            Đặt Hàng
          </Button>
        </div>
      </div>
      <Modal
        title={
          <span className="flex text-2xl text-red-500 items-center gap-3">
            <VscError size={30} />
            Lỗi
          </span>
        }
        closable={false}
        open={openModalCheckoutError}
        footer={
          <div className="w-full flex justify-center items-center">
            <Button
              size="large"
              className="bg-primary text-white hover:opacity-80"
              onClick={() => navigate("/cart")}
            >
              Trở về giỏ hàng
            </Button>
          </div>
        }
      >
        <p className="text-lg font-semibold">{checkoutMessage}</p>
      </Modal>
      <ModalOTP
        onVerify={handleOnVerifyOTP}
        user={user}
        openOTPModal={openModalOTP}
        handleCancelOTP={handleCloseModalOTP}
      />
    </>
  );
};

export default memo(PaymentMethodSection);
