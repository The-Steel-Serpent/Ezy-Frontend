import React, { memo } from "react";

const MiniCartItem = (props) => {
  const { item } = props;

  return (
    <a
      href={`/product-details/${item?.ProductVarient?.product_id}`}
      className="grid grid-cols-12 p-3 gap-3 hover:bg-slate-200 cursor-pointer"
    >
      <div className="col-span-2">
        <img
          src={
            item?.ProductVarient?.ProductClassify != null
              ? item?.ProductVarient?.ProductClassify?.thumbnail
              : item?.ProductVarient?.Product?.thumbnail
          }
          className="size-9"
        />
      </div>
      <div className="col-span-7">
        <span className="text-ellipsis line-clamp-1">
          {item?.ProductVarient?.Product?.product_name}
        </span>
      </div>
      <div className="col-span-3">
        <span className="text-primary text-end text-ellipsis line-clamp-1">
          <sup>₫</sup>
          {item?.price?.toLocaleString("vi-VN")}
        </span>
      </div>
    </a>
  );
};

export default memo(MiniCartItem);
