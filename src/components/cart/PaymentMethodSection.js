import { Button, Radio } from "antd";
import React, { memo, useReducer, useState } from "react";
import ModalVoucher from "./ModalVoucher";
const momo = require("../../assets/momo.png");
const vnpay = require("../../assets/vnpay.png");
const cod = require("../../assets/cod.png");
const wallet = require("../../assets/wallet.png");
const PaymentMethodArray = [
  {
    name: "Thanh Toán Khi Nhận Hàng",
    value: "Thanh Toán Khi Nhận Hàng",
    image: cod,
  },
  {
    name: "Ví Momo",
    value: "Ví Momo",
    image: momo,
  },
  {
    name: "Ví VNPay",
    value: "Ví VNPay",
    image: vnpay,
  },
  {
    name: "Ví EzyPay",
    value: "Ví EzyPay",
    image: wallet,
  },
];

const PaymentMethodSection = (props) => {
  const { total } = props;

  return (
    <>
      <div className="w-full flex flex-col gap-10">
        <span className="text-lg font-semibold">Phương Thức Thanh Toán</span>
        <div className="grid grid-cols-12">
          <div className="col-span-5">
            <div className="w-full">
              <Radio.Group
                className="flex flex-col gap-3"
                defaultValue={"Ví Momo"}
              >
                {PaymentMethodArray.map((item) => (
                  <Radio value={item.value}>
                    <div className="w-full flex items-center gap-2">
                      <img src={item.image} alt="" className="w-11" />
                      <span>{item.name}</span>
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
        <div className="w-full flex justify-end items-center">
          <Button className="w-[160px] h-[45px] text-lg bg-primary text-white hover:opacity-80">
            Đặt Hàng
          </Button>
        </div>
      </div>
    </>
  );
};

export default memo(PaymentMethodSection);
