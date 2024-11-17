import { Badge, Button, List, Popover } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsData } from "../../redux/notificationsSlice";
import NotificationMiniItem from "./NotificationMiniItem";
import { useNavigate } from "react-router-dom";
const NotificationPopover = () => {
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      openPopover: false,
      error: "",
    }
  );
  useEffect(() => {
    if (user?.user_id !== "") {
      dispatch(
        fetchNotificationsData({ userID: user?.user_id, page: 1, limit: 5 })
      );
    }
  }, [dispatch, user]);

  const handleOpenChange = (open) => {
    setLocalState({ type: "openPopover", payload: open });
  };
  const content = (
    <div className="w-[400px]">
      <List
        dataSource={
          Array.isArray(notifications.notifications)
            ? notifications.notifications
            : []
        }
        renderItem={(item) => (
          <List.Item
            className={`w-full hover:bg-slate-100 cursor-pointer ${
              item.is_read === 0 ? "bg-third" : ""
            }`}
          >
            <NotificationMiniItem item={item} />
          </List.Item>
        )}
      />
      <Button
        className="w-full mt-5 "
        onClick={() => navigate("/user/notification?type=order")}
      >
        Xem Tất Cả
      </Button>
    </div>
  );

  return (
    <Popover
      open={localState.openPopover}
      onOpenChange={handleOpenChange}
      title="Thông báo mới nhận"
      content={content}
    >
      <a
        href="/user/notification?type=order"
        className="flex items-center nav-link-hoverable gap-1"
      >
        <Badge count={notifications.notSeen} size="small" showZero>
          <IoMdNotificationsOutline size={21} className="text-white" />
        </Badge>
        Thông báo
      </a>
    </Popover>
  );
};

export default memo(NotificationPopover);
