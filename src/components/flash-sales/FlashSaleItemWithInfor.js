import { Button, Image, Progress, Rate } from "antd";
import React, { memo } from "react";
import {
  formatCurrency,
  formatHideCurrency,
} from "../../helpers/formatCurrency";
import { IoFlash } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const FlashSaleItemWithInfor = ({ item, status }) => {
  const sale_percents = Math.round(
    ((item?.original_price - item?.flash_sale_price) / item?.original_price) *
      100
  );
  const soldPercent = Math.round((item?.sold / item?.quantity) * 100);
  const navigate = useNavigate();
  return (
    <div
      className="col-span-3 flex flex-col rounded border-[1px] shadow border-solid bg-white hover:shadow-xl cursor-pointer "
      onClick={() => {
        navigate(`/product-details/${item?.product_id}`);
      }}
    >
      <Image src={item?.Product?.thumbnail} />
      <div className="p-4 flex flex-col">
        <div className="w-full line-clamp-2 text-ellipsis  font-semibold h-[37px]">
          {item?.Product?.product_name}
        </div>
        <Rate
          disabled={true}
          value={item?.Product?.avgRating}
          className="text-sm"
        />
        <div className="flex gap-1 items-center">
          <span className="text-xs line-through text-neutral-400">
            <sup>đ</sup>
            {formatCurrency(item?.original_price).replace("đ", "")}
          </span>
          {(status === "active" || status === "ended") && (
            <span className="flex items-center text-xs bg-yellow-300 text-red-500 p-[1px] rounded">
              <IoFlash />-{sale_percents}%
            </span>
          )}
        </div>
        <div className="w-full grid grid-cols-12 items-center">
          <div className="col-span-7">
            <span className="text-2xl font-semibold text-primary">
              <sup>đ</sup>
              {status === "active"
                ? formatCurrency(item?.flash_sale_price).replace("đ", "")
                : formatHideCurrency(item?.flash_sale_price).replace("đ", "")}
            </span>
            <div className="relative">
              <Progress
                format={(percent) => <span className="text-white"></span>}
                percent={status === "ended" ? 100 : soldPercent}
                percentPosition={{
                  align: "center",
                  type: "inner",
                }}
                size={[140, 20]}
                strokeColor="#ff4d4f"
                trailColor="#febca5"
              />
              <div className="absolute w-full top-0 translate-x-[20%] translate-y-[2px]">
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
          <div className="col-span-5 flex flex-col justify-end items-end h-full">
            <Button
              size="large"
              className="bg-primary text-white hover:opacity-80"
              onClick={() => {
                navigate(`/product-details/${item?.product_id}`);
              }}
            >
              {status === "active" ? "Mua ngay" : "Xem chi tiết"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FlashSaleItemWithInfor);
