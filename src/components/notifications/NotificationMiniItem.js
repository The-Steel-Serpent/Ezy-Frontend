import { Badge } from "antd";
import React, { memo } from "react";
import { markNotificationAsRead } from "../../services/notificationsService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchNotificationsData } from "../../redux/notificationsSlice";
import { IoWalletOutline } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";

const NotificationMiniItem = (props) => {
  const { item } = props;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleViewDetail = async (item) => {
    try {
      const res = await markNotificationAsRead(item.notification_id);
      if (res.success) {
        navigate(item.url);
        dispatch(
          fetchNotificationsData({ userID: user?.user_id, page: 1, limit: 5 })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Badge size="default" className="w-full" dot={item.is_read === 0}>
      <div
        className={`flex gap-2 w-full `}
        onClick={() => item.url !== "" && handleViewDetail(item)}
      >
        {item.thumbnail !== "" && (
          <img src={item.thumbnail} alt="" className="size-16" />
        )}
        {item.thumbnail === "" && (
          <div className="size-16 bg-primary text-white flex justify-center items-center">
            {item.notifications_type === "wallet" ? (
              <IoWalletOutline className="text-[30px]" />
            ) : (
              <IoIosSettings className="text-[30px]" />
            )}
          </div>
        )}

        <div className="flex flex-col w-full">
          <span className="text-base font-semibold">{item.title}</span>
          <span className="text-xs">{item.content}</span>
        </div>
      </div>
    </Badge>
  );
};

export default memo(NotificationMiniItem);
