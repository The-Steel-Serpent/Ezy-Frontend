import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { Link } from "react-router-dom";
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // Hàng triệu
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // Hàng nghìn
  } else {
    return num.toString(); // Dưới 1000 không cần format
  }
}
const ProductCard = ({ value, key }) => {
  return (
    <>
      <Link
        className="animation-pulse relative w-32 lg:w-48 col-span-4 lg:col-span-2 mt-3"
        to={"/product-details/" + { key }}
      >
        <Card
          key={key}
          loading={false}
          hoverable
          cover={<img src={value.thumbnail} />}
        >
          <Meta style={{ fontSize: 14 }} title={value.name} />
          <div className="flex lg:flex-row flex-col w-100 justify-between items-start lg:items-center mt-4">
            <div className="text-primary font-bold">đ{value.price}.000</div>
            <div className="text-[10px] pt-1">
              Đã bán {formatNumber(value.sold)}
            </div>
          </div>
          <div className="absolute top-0 right-0 text-xs bg-primary text-white pr-1 pl-1">
            -34%
          </div>
        </Card>
      </Link>
    </>
  );
};

export default React.memo(ProductCard);
