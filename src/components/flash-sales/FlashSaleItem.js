import React, { memo } from "react";
import { formatCurrency } from "../../helpers/formatCurrency";
import { IoIosFlash } from "react-icons/io";
import { Progress } from "antd";

const FlashSaleItem = ({ item }) => {
  const discountPercent = Math.round(
    ((item?.original_price - item?.flash_sale_price) / item?.original_price) *
      100
  );

  const soldPercent = Math.round((item?.sold / item?.quantity) * 100);

  return (
    <div className="max-w-40">
      {/**thumbnail */}
      <div className="w-fit relative flex gap-2">
        <img className="size-40" src={item?.Product?.thumbnail} alt="" />
        <div className="absolute top-0 right-0">
          <div className="bg-yellow-500 text-white text-xs px-2 py-1  flex justify-center items-center">
            <IoIosFlash /> - {discountPercent}%
          </div>
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="bg-red-600 text-white text-xs px-2 py-1  flex justify-center items-center">
            11th11
          </div>
        </div>
      </div>
      {/**Price */}
      <div className="w-full text-center py-2 text-primary text-lg">
        <sup>đ</sup>
        <span>{formatCurrency(item?.flash_sale_price)}</span>
      </div>
      <div className="relative">
        <Progress
          className="max-w-full"
          format={(percent) => <span className="text-white"></span>}
          percent={soldPercent}
          percentPosition={{
            align: "center",
            type: "inner",
          }}
          size={[160, 20]}
          strokeColor="#ff4d4f"
          trailColor="#febca5"
        />
        <div className="absolute w-full top-0 translate-x-[26%]">
          <span className="text-white text-lg">Đã bán {item?.sold}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(FlashSaleItem);
