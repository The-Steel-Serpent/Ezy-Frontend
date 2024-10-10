import { motion } from "framer-motion";
import { Card, Rate } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // Hàng triệu
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // Hàng nghìn
  } else {
    return num.toString(); // Dưới 1000 không cần format
  }
}
const ProductCard = ({ value, loading, itemsPerRow = 6 }) => {
  const price =
    value?.base_price - (value?.base_price * value?.sale_percents) / 100;
  return (
    <>
      <motion.a
        href={"/product-details/" + { value }.value?.product_id}
        className={`animation-pulse relative w-32 lg:w-48 ${
          itemsPerRow === 6 ? "lg:col-span-2" : "lg:col-span-2"
        } col-span-4  mt-3`}
      >
        <Card
          loading={loading}
          hoverable
          cover={
            <img
              className="size-[190px]"
              loading="lazy"
              src={value.thumbnail}
            />
          }
        >
          <Meta style={{ fontSize: 14 }} title={value?.product_name} />
          <div className="flex lg:flex-row flex-col w-100 items-start lg:items-center mt-4 text-ellipsis text-nowrap line-clamp-1">
            <div className="text-primary font-bold text-base mr-1">
              <sup>₫</sup>
              {price?.toLocaleString("vi-VN")}
            </div>
            {value?.sale_percents > 0 && (
              <div className="text-slate-400 line-through text-xs text-ellipsis line-clamp-1 text-nowrap">
                <sup>₫</sup>
                {value?.base_price?.toLocaleString("vi-VN")}
              </div>
            )}
          </div>
          <div className="flex lg:flex-row flex-col w-100  items-start lg:items-center">
            <Rate
              disabled
              value={value?.avgRating}
              className="text-[11px] mr-1"
            />

            <div className="text-[10px] pt-1">
              Đã bán {formatNumber(value?.sold)}
            </div>
          </div>

          <div className="absolute top-0 right-0 text-xs bg-primary text-white pr-1 pl-1">
            {value?.sale_percents > 0 && "-" + value?.sale_percents + "%"}
          </div>
        </Card>
      </motion.a>
    </>
  );
};

export default React.memo(ProductCard);
