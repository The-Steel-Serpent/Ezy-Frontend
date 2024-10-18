import { Avatar, Divider, Image, Input } from "antd";
import React, { memo } from "react";

const CheckoutCartItem = (props) => {
  const { item } = props;
  return (
    <>
      <div className="grid grid-cols-12 items-center px-[30px] ">
        <div className="col-span-2 flex justify-center">
          <Image
            className="size-24"
            src={
              item?.ProductVarient?.ProductClassify !== null
                ? item?.ProductVarient?.ProductClassify?.thumbnail
                : item?.ProductVarient?.Product?.thumbnail
            }
          />
        </div>
        <div className="col-span-10 flex flex-col items-start gap-2 relative h-full">
          <span className="text-base font-garibato font-semibold text-ellipsis line-clamp-1">
            {item?.ProductVarient?.Product?.product_name}
          </span>
          <span className="w-fit flex gap-3 items-center">
            Phân loại hàng:{" "}
            {item?.ProductVarient?.ProductClassify?.product_classify_name}
            {item?.ProductVarient?.ProductSize &&
              item?.ProductVarient?.ProductSize?.product_size_name}
            <span>-</span>
            <span>Số lượng: {item?.quantity}</span>
          </span>
          <div className="absolute bottom-0 w-full">
            <div className="flex justify-between ">
              <div className="flex gap-2">
                <span className="flex text-lg text-primary items-center font-garibato font-bold">
                  <sup>₫</sup>
                  {item?.price?.toLocaleString("vi-VN")}
                </span>
                {item?.ProductVarient?.sale_percents > 0 && (
                  <span className="flex items-center text-slate-400 line-through font-garibato italic">
                    <sup>₫</sup>
                    {(
                      item?.quantity * item?.ProductVarient?.price
                    ).toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CheckoutCartItem);
