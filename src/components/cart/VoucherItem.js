import { Image, Radio } from "antd";
import React, { memo } from "react";
import logoFreeShip from "../../assets/logo-free-ship.png";
import { IoBagHandle } from "react-icons/io5";
import formatNumber from "../../helpers/formatNumber";

const VoucherItem = (props) => {
  const { item } = props;
  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    };
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("vi-VN", options);
    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${formattedDate} ${formattedTime}`;
  };
  return (
    <div
      className={`flex items-center w-full mb-2 h-[121px] ${
        item?.isVoucherValid ? "cursor-pointer" : "disabled"
      }`}
    >
      <div
        className={`${
          item?.discount_voucher_type_id === 1 ? "bg-emerald-500" : "bg-red-700"
        } size-[121px]  relative  clip-vertical-sawtooth`}
      >
        <div className={`w-full h-full pl-2 flex justify-center items-center `}>
          {item?.discount_voucher_type_id === 1 && (
            <div className="flex flex-col items-center justify-center">
              <img src={logoFreeShip} className="size-14" />
              <span className="text-white text-sm text-center">
                Miễn Phí Vận Chuyển
              </span>
            </div>
          )}
          {item?.discount_voucher_type_id === 2 && (
            <div className="flex flex-col items-center justify-center gap-3">
              <IoBagHandle fontSize={30} className="text-white" />
              <span className="text-white text-sm text-center">Ezy</span>
            </div>
          )}
        </div>
      </div>
      <div className="h-full  grid grid-cols-12 flex-1 border-[1px] shadow rounded">
        <div className="col-span-10 p-2">
          <div className="flex flex-col">
            <span
              className="text-lg line-clamp-1 text-ellipsis"
              title={item?.discount_voucher_name}
            >
              {item?.discount_voucher_name}
            </span>
            <span className="text-base flex gap-1 text-neutral-400">
              <span>Đơn tối thiểu</span>
              <span className="flex items-center">
                <sup>đ</sup> {formatNumber(item?.min_order_value)}
              </span>
            </span>
          </div>
          <div className="text-sm text-neutral-400 mt-7">
            Còn lại: {formatNumber(item?.quantity)}, HSD:{" "}
            {formatDate(item?.ended_at)}
          </div>
        </div>
        <div className="col-span-2 flex justify-center">
          <Radio />
        </div>
      </div>
    </div>
  );
};

export default memo(VoucherItem);
