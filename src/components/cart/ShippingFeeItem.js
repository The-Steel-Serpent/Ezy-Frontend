import { CheckOutlined } from "@ant-design/icons";
import React, { memo } from "react";

const ShippingFeeItem = (props) => {
  const { item, isSelected } = props;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  return (
    <div className={`w-full flex flex-col gap-2 relative cursor-pointer`}>
      <div
        className={`w-[4px] h-full absolute ${
          isSelected ? "bg-primary" : "bg-neutral-500"
        }`}
      ></div>
      <div className="flex justify-start items-center text-lg gap-3 ml-3">
        <span className="text-base font-semibold">
          {item?.service_id === 53321
            ? "Tiêu Chuẩn"
            : item?.service_id === 53320
            ? "Hỏa Tốc"
            : "Hàng Cồng Kềnh"}
        </span>

        <span className="text-primary font-bold">
          <sup>đ</sup>
          {item?.fee?.total_fee?.toLocaleString("vi-VN")}
        </span>
      </div>
      <div className="flex gap-1 text-neutral-500 font-semibold ml-3">
        <span>Dự kiến giao hàng:</span>
        <span>{formatDate(item?.fee?.expected_delivery_time)}</span>
      </div>
      {isSelected && (
        <div className="absolute right-0 h-full flex justify-center items-center">
          <CheckOutlined className="text-primary text-[20px]" />
        </div>
      )}
    </div>
  );
};

export default memo(ShippingFeeItem);
