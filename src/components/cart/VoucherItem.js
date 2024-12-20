import { Checkbox, Image, message, Popover, Radio } from "antd";
import React, { memo } from "react";
import logoFreeShip from "../../assets/logo-free-ship.png";
import { IoBagHandle } from "react-icons/io5";
import formatNumber from "../../helpers/formatNumber";
import { RiFileCopy2Line } from "react-icons/ri";

const VoucherItem = (props) => {
  const { item, isSelected, onCheckboxChange } = props;
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
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép mã voucher");
  };
  const content = () => {
    return (
      <div className="w-[600px] text-base">
        <div className="flex items-center gap-2">
          <span className="font-semibold ">Tên Voucher:</span>
          <span className="text-primary">{item?.discount_voucher_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Đơn tối thiểu:</span>
          <span>{formatNumber(item?.min_order_value)}đ</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Tên Voucher:</span>
          <span>{item?.discount_voucher_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Mã:</span>
          <span
            className="flex items-center gap-2 cursor-pointer text-primary"
            onClick={() => handleCopy(item?.discount_voucher_code)}
          >
            {item?.discount_voucher_code} <RiFileCopy2Line />{" "}
          </span>
        </div>
        <div className="flex  items-center gap-2">
          <span className="font-semibold">Số lượt tối đa: </span>
          <span>{item?.usage}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">Điều kiện:</span>
          <span>{item?.description}</span>
        </div>
      </div>
    );
  };

  return (
    <Popover
      title={<span className="text-lg font-semibold">Chi tiết voucher</span>}
      content={content}
    >
      <div
        className={`flex items-center w-full mb-2 h-[121px] ${
          item?.isVoucherValid ? "cursor-pointer" : "disabled"
        }`}
      >
        <div
          className={`${
            item?.discount_voucher_type_id === 1
              ? "bg-emerald-500"
              : "bg-red-700"
          } size-[121px]  relative  clip-vertical-sawtooth`}
        >
          <div
            className={`w-full h-full pl-2 flex justify-center items-center `}
          >
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
                title={
                  "Tên Voucher: " +
                  item?.discount_voucher_name +
                  "\n- Đơn tối thiểu: đ" +
                  formatNumber(item?.min_order_value) +
                  "\n - Mã: " +
                  item?.discount_voucher_code +
                  "\n - Điều kiện: " +
                  item?.description
                }
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
            <Checkbox
              className={
                item?.isVoucherValid ? "cursor-pointer" : "pointer-events-none"
              }
              checked={isSelected}
              onChange={onCheckboxChange}
            />
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default memo(VoucherItem);
