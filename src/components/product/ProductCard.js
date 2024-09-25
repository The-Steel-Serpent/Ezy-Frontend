import { Card } from "antd";
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
const ProductCard = ({ value, key, itemsPerRow = 6 }) => {
  return (
    <>
      <a
        href={"/product-details/" + { value }.value?.product_id}
        className={`animation-pulse relative w-32 lg:w-48 ${
          itemsPerRow === 6 ? "lg:col-span-2" : "lg:col-span-2"
        } col-span-4  mt-3`}
      >
        <Card
          key={key}
          loading={false}
          hoverable
          cover={<img src={value.thumbnail} />}
        >
          <Meta style={{ fontSize: 14 }} title={value?.product_name} />
          <div className="flex lg:flex-row flex-col w-100 justify-between items-start lg:items-center mt-4">
            <div className="text-primary font-bold">
              <sup>₫</sup>
              {value?.base_price?.toLocaleString("vi-VN")}
            </div>
            <div className="text-[10px] pt-1">
              Đã bán {formatNumber(value?.sold)}
            </div>
          </div>
          <div className="absolute top-0 right-0 text-xs bg-primary text-white pr-1 pl-1">
            {value?.sale_percents > 0 && "-" + value?.sale_percents + "%"}
          </div>
        </Card>
      </a>
    </>
  );
};

export default React.memo(ProductCard);
