import React, { memo } from "react";
import formatNumber from "../../helpers/formatNumber";
import { Rate } from "antd";
import no1Icon from "../../assets/no1-icon.png";
import no2Icon from "../../assets/no2-icon.png";
import no3Icon from "../../assets/no-3-icon.png";
import { useNavigate } from "react-router-dom";
const TopProductItem = (props) => {
  const { item, key, top } = props;
  const navigate = useNavigate();
  const price = item?.discounted_price;
  const salePrice =
    item?.flashSales?.length > 0 &&
    item?.flashSales[0].FlashSaleTimeFrame !== null
      ? item?.flashSales[0].flash_sale_price
      : price;
  return (
    <div
      key={key}
      className="w-full col-span-2 flex flex-col bg-white rounded border-[1px] shadow cursor-pointer hover:shadow-lg"
      onClick={() => navigate(`/product-details/${item.product_id}`)}
    >
      <div className="w-full relative">
        <img src={item.thumbnail} alt="" />
        {top === 1 && (
          <img src={no1Icon} alt="" className="absolute top-0 left-0 size-11" />
        )}
        {top === 2 && (
          <img src={no2Icon} alt="" className="absolute top-0 left-0 size-11" />
        )}
        {top === 3 && (
          <img src={no3Icon} alt="" className="absolute top-0 left-0 size-11" />
        )}
        {top > 3 && (
          <div className="absolute top-1 left-2 bg-slate-300 text-neutral-700 text-xs px-4 py-1 rounded-full">
            {top}
          </div>
        )}
      </div>
      <div className="p-2 flex flex-col gap-1">
        <div className="text-ellipsis line-clamp-2 break-words ">
          {item.product_name}
        </div>

        <span className="text-primary">
          <sup>₫</sup>
          {salePrice?.toLocaleString("vi-VN")}
        </span>
      </div>
      <div className="p-2 flex justify-between text-xs text-neutral-400">
        <span>Đã bán {formatNumber(item.sold)}</span>
        <div>
          <Rate
            className="text-xs top-rating"
            value={item.avgRating}
            disabled={true}
          />{" "}
          ({item.total_reviews})
        </div>
      </div>
    </div>
  );
};

export default memo(TopProductItem);
