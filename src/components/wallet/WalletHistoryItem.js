import { WalletFilled } from "@ant-design/icons";
import React, { memo } from "react";

const WalletHistoryItem = ({ item }) => {
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
  return (
    <div className="grid grid-cols-12 pt-3">
      <div className="col-span-2 flex justify-start items-center ">
        <div className="size-14 rounded-full bg-primary flex justify-center items-center">
          <WalletFilled className="text-white text-2xl" />
        </div>
      </div>
      <div className="col-span-7 px-2 flex flex-col justify-start items-start">
        <span className="font-semibold text-xl">{item?.transaction_type}</span>
        <span className="text-base">{item?.description}</span>
        <span className="text-sm text-gray-500">
          {formatDateTime(item?.transaction_date)}
        </span>
      </div>
      <div className="col-span-3 flex justify-end items-center">
        <span
          className={`text-lg font-semibold ${
            item?.amount?.toString().includes("-") ? "text-red-500" : ""
          }`}
        >
          {formatCurrency(item?.amount || 0)}
          <sup>đ</sup>
        </span>
      </div>
    </div>
  );
};

export default memo(WalletHistoryItem);
