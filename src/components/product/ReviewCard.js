import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React, { memo } from "react";
import ReactStars from "react-rating-star-with-type";
const ReviewCard = ({ value }) => {
  const maskUsername = (username) => {
    if (!username) return "";
    const firstChar = username.charAt(0);
    const lastChar = username.charAt(username.length - 1);
    const maskedPart = "*".repeat(username.length - 2);
    return `${firstChar}${maskedPart}${lastChar}`;
  };
  return (
    <div className="flex flex-row items-center gap-3">
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
      <div className="flex flex-col">
        <div className="">{maskUsername(value?.UserAccount?.username)}</div>
        <ReactStars
          value={value?.rating}
          activeColor="#66cce6"
          inactiveColor="#66cce6"
          isEdit={false}
          size={13}
        />
      </div>
      {/* <div className="flex flex-row">
        <div className="">{value?.created_at}</div>
      </div> */}
    </div>
  );
};

export default memo(ReviewCard);
