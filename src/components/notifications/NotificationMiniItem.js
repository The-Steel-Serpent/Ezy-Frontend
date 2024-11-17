import { Badge } from "antd";
import React, { memo } from "react";

const NotificationMiniItem = (props) => {
  const { item } = props;
  return (
    <Badge size="default" className="w-full" dot={item.is_read === 0}>
      <div className={`flex gap-2 w-full`}>
        <img src={item.thumbnail} alt="" className="size-16" />
        <div className="flex flex-col w-full">
          <span className="text-base font-semibold">{item.title}</span>
          <span className="text-xs">{item.content}</span>
        </div>
      </div>
    </Badge>
  );
};

export default memo(NotificationMiniItem);
