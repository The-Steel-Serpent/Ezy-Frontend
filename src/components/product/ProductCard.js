import { motion } from "framer-motion";
import { Card, Rate } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { FcFlashAuto } from "react-icons/fc";
import { IoFlash } from "react-icons/io5";
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
  const salePrice =
    value?.flashSales?.length > 0 &&
    value?.flashSales[0].FlashSaleTimeFrame !== null
      ? value?.flashSales[0].flash_sale_price
      : price;
  const salePercent =
    value?.flashSales?.length > 0 &&
    value?.flashSales[0].FlashSaleTimeFrame !== null
      ? Math.round(
          ((value?.flashSales[0].original_price -
            value?.flashSales[0].flash_sale_price) /
            value?.flashSales[0].original_price) *
            100
        )
      : value?.sale_percents;
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
              {salePrice?.toLocaleString("vi-VN")}
            </div>
            {salePercent > 0 && (
              <div className="text-slate-400 line-through text-xs text-ellipsis line-clamp-1 text-nowrap">
                <sup>₫</sup>
                {value?.base_price?.toLocaleString("vi-VN")}
              </div>
            )}
          </div>
          <div className="flex lg:flex-row flex-col w-100  items-start lg:items-center">
            <Rate
              disabled
              allowHalf
              value={value?.avgRating || 0}
              className="text-[11px] mr-1 top-rating"
            />

            <div className="text-[10px] pt-1">
              Đã bán {formatNumber(value?.sold)}
            </div>
            {value?.flashSales?.length > 0 &&
              value?.flashSales[0].FlashSaleTimeFrame !== null && (
                <IoFlash className="mr-2 text-lg text-orange-400" />
              )}
          </div>

          <div className="absolute top-0 right-0 text-xs bg-yellow-500 text-white pr-1 pl-1">
            {salePercent > 0 && "-" + salePercent + "%"}
          </div>
        </Card>
      </motion.a>
    </>
  );
};

export default React.memo(ProductCard);
