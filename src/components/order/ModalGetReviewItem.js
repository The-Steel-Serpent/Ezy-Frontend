import { Avatar, Divider, Rate } from "antd";
import React, { memo } from "react";

import { useSelector } from "react-redux";
import ReactStars from "react-rating-star-with-type";
import { UserOutlined } from "@ant-design/icons";
import { format } from "date-fns";
const ModalGetReviewItem = ({ item }) => {
  const handleViewProduct = () => {
    window.location.href = `/product-details/${item.ProductVarient.Product.product_id}`;
  };
  console.log(item);
  const user = useSelector((state) => state.user);
  const formattedDate = item?.review_created_at
    ? format(new Date(item?.review_created_at), "yyyy-MM-dd HH:mm")
    : "";
  return (
    <div className="w-full flex flex-col gap-4">
      <div
        className="flex gap-2 items-start cursor-pointer"
        onClick={handleViewProduct}
      >
        <img
          className="size-20 rounded border-2 border-solid border-neutral-300"
          src={item.thumbnail}
          alt={item.varient_name}
        />
        <div className="flex flex-col">
          <span className="text-base font-semibold line-clamp-2 text-ellipsis">
            {item.varient_name}
          </span>
          {item.classify !== "" && (
            <span className="text-sm text-neutral-500">
              Phân Loại Hàng: {item.classify}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <div className="w-fit">
          {user?.avt_url != null ? (
            <img className="size-14 rounded-full" src={user?.avt_url} />
          ) : (
            <>
              <Avatar
                size={45}
                className="bg-primary"
                icon={<UserOutlined className="text-white" />}
              />
            </>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm">{user?.username}</div>
          <ReactStars
            value={item?.rating}
            activeColor="#66cce6"
            inactiveColor="#66cce6"
            isEdit={false}
            size={13}
          />

          <div className="mt-2">{item?.review_content}</div>
          <div className="flex flex-row items-start justify-start">
            <div className="text-xs text-slate-500">{formattedDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalGetReviewItem);
