import { UserOutlined } from "@ant-design/icons";
import { Avatar, Divider } from "antd";
import React, { memo } from "react";
import ReactStars from "react-rating-star-with-type";
import { format } from "date-fns";
const ReviewCard = ({ value }) => {
  const maskUsername = (username) => {
    if (!username) return "";
    const firstChar = username.charAt(0);
    const lastChar = username.charAt(username.length - 1);
    const maskedPart = "*".repeat(username.length - 2);
    return `${firstChar}${maskedPart}${lastChar}`;
  };

  const formattedDate = value?.created_at
    ? format(new Date(value?.created_at), "yyyy-MM-dd HH:mm")
    : "";
  return (
    <div className="flex flex-row gap-3">
      <div className="w-fit">
        {value?.UserAccount?.avt_url != null ? (
          <img
            className="size-10 rounded-full"
            src={value?.UserAccount?.avt_url}
          />
        ) : (
          <>
            <Avatar size={40} className="bg-primary" icon={<UserOutlined />} />
          </>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm">
          {maskUsername(value?.UserAccount?.username)}
        </div>
        <ReactStars
          value={value?.rating}
          activeColor="#66cce6"
          inactiveColor="#66cce6"
          isEdit={false}
          size={13}
        />
        <div className="flex flex-row items-center justify-center">
          <div className="text-xs text-slate-500">{formattedDate}</div>
          <Divider className="border-s-slate-400 h-4 top-0" type="vertical" />
          <div className="text-xs text-slate-500">
            Phân loại hàng:{" "}
            {value?.ProductVarient?.ProductClassify?.product_classify_name +
              " " +
              value?.ProductVarient?.ProductSize?.product_size_name}
          </div>
        </div>
        <div className="mt-2">{value?.review_content}</div>
      </div>
    </div>
  );
};

export default memo(ReviewCard);
