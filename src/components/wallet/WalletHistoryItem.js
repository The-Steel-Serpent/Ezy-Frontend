import { WalletFilled } from "@ant-design/icons";
import { message, Popover } from "antd";
import React, { memo, useState } from "react";
import { RiFileCopy2Line } from "react-icons/ri";

const WalletHistoryItem = ({ item }) => {
  const [openPopover, setOpenPopover] = useState(false);
  const formatCurrency = (balance) => {
    return new Intl.NumberFormat("vi-VN").format(balance);
  };
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép mã giao dịch");
  };
  const content = () => {
    return (
      <div className="w-[400px]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span> Mã giao dịch:</span>
            <span
              className="font-semibold flex items-center text-primary gap-2 cursor-pointer"
              onClick={handleCopy.bind(this, item?.wallet_transaction_id)}
            >
              {item?.wallet_transaction_id} <RiFileCopy2Line />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span> Loại giao dịch:</span>
            <span className="font-semibold flex items-center">
              {item?.transaction_type}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span> Mô tả:</span>
            <span className="font-semibold flex items-center">
              {item?.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span> Ngày giao dịch:</span>
            <span className="font-semibold flex items-center">
              {formatDateTime(item?.transaction_date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span> Số dư: </span>
            <span
              className={`text-lg font-semibold ${
                item?.amount?.toString().includes("-")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {(!item?.amount?.toString().includes("-") ? "+" : "") +
                formatCurrency(item?.amount || 0)}
              <sup>đ</sup>
            </span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Popover
      content={content}
      title={`Chi tiết giao dịch`}
      open={openPopover}
      placement="bottomLeft"
      onOpenChange={(newOpen) => setOpenPopover(newOpen)}
    >
      <div className="grid grid-cols-12 pt-3">
        <div className="col-span-2 flex justify-start items-center ">
          <div className="size-14 rounded-full bg-primary flex justify-center items-center">
            <WalletFilled className="text-white text-2xl" />
          </div>
        </div>
        <div className="col-span-7 px-2 flex flex-col justify-start items-start">
          <span className="font-semibold text-xl">
            {item?.transaction_type}
          </span>
          <span
            className="text-base line-clamp-2 text-ellipsis cursor-pointer"
            title={item?.description}
          >
            {item?.description}
          </span>
          <span className="text-sm text-gray-500">
            {formatDateTime(item?.transaction_date)}
          </span>
        </div>
        <div className="col-span-3 flex justify-end items-center">
          <span
            className={`text-lg font-semibold ${
              item?.amount?.toString().includes("-")
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {(!item?.amount?.toString().includes("-") ? "+" : "") +
              formatCurrency(item?.amount || 0)}
            <sup>đ</sup>
          </span>
        </div>
      </div>
    </Popover>
  );
};

export default memo(WalletHistoryItem);
