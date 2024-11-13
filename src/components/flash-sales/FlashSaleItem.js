import React, { memo } from "react";
import {
  formatCurrency,
  formatHideCurrency,
} from "../../helpers/formatCurrency";
import { IoIosFlash } from "react-icons/io";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { FcFlashAuto } from "react-icons/fc";
const FlashSaleItem = ({ item, status }) => {
  const navigate = useNavigate();
  const discountPercent = Math.round(
    ((item?.original_price - item?.flash_sale_price) / item?.original_price) *
      100
  );

  const soldPercent = Math.round((item?.sold / item?.quantity) * 100);
  const handleOnViewDetail = () => {
    navigate(`/product-details/${item?.product_id}`);
  };
  return (
    <div className="max-w-40 cursor-pointer" onClick={handleOnViewDetail}>
      {/**thumbnail */}
      <div className="w-fit relative flex gap-2">
        <img className="size-40" src={item?.Product?.thumbnail} alt="" />
        {status !== "waiting" && (
          <div className="absolute top-0 right-0">
            <div className="bg-yellow-500 text-white text-xs px-2 py-1  flex justify-center items-center">
              <IoIosFlash /> - {discountPercent}%
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0">
          <div className="bg-red-600 text-white text-xs px-2 py-1  flex justify-center items-center">
            <FcFlashAuto className="text-xl" />
          </div>
        </div>
      </div>
      {/**Price */}
      <div className="w-full text-center py-2 text-primary text-lg">
        <sup>đ</sup>
        <span>
          {status === "waiting"
            ? formatHideCurrency(item?.flash_sale_price)
            : formatCurrency(item?.flash_sale_price)}
          {/* {formatCurrency(item?.flash_sale_price).replace("đ", "")} */}
        </span>
      </div>
      <div className="relative">
        <Progress
          className="max-w-full"
          format={(percent) => <span className="text-white"></span>}
          percent={status === "ended" ? 100 : soldPercent}
          percentPosition={{
            align: "center",
            type: "inner",
          }}
          size={[160, 20]}
          strokeColor="#ff4d4f"
          trailColor="#febca5"
        />
        <div className="absolute w-full top-0 translate-x-[26%]">
          <span className="text-white text-lg">
            {status === "ended"
              ? "Đã kết thúc"
              : status === "waiting"
              ? "Sắp diễn ra"
              : `Đã bán ${item?.sold}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(FlashSaleItem);
