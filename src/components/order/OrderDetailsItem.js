import { Tag } from "antd";
import React, { memo } from "react";

const OrderDetailsItem = (props) => {
  const { item } = props;

  return (
    <div
      className="grid grid-cols-12 w-full cursor-pointer"
      //   onClick={handleViewProduct}
    >
      <div className="col-span-1">
        <img
          className="size-20 rounded border-2 border-solid border-neutral-300"
          src={item.thumbnail}
          alt={item.varient_name}
        />
      </div>
      <div className="col-span-9 flex flex-col pl-3">
        <p className="text-base font-semibold line-clamp-2 text-ellipsis mb-0">
          {item.varient_name}
        </p>
        {item.classify !== "" && (
          <p className="text-sm text-neutral-500 mb-0">
            Phân loại hàng: {item.classify}
          </p>
        )}

        <p className="text-black mb-0">x{item.quantity}</p>
        <Tag className="w-fit mt-1" color="blue">
          7 ngày trả hàng
        </Tag>
      </div>
      <div className="col-span-2 flex justify-end items-center gap-2">
        {item.discountPrice > 0 && (
          <span className="line-through text-neutral-400">
            {"đ" + item.discountPrice.toLocaleString("vi-VN")}
          </span>
        )}
        <span className="text-primary font-semibold">
          {"đ" + item.totalPrice.toLocaleString("vi-VN")}
        </span>
      </div>
    </div>
  );
};

export default memo(OrderDetailsItem);
