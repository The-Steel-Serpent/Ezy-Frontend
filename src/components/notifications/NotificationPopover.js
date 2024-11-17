import { Badge, Button, List, Popover } from "antd";
import React, { memo, useEffect, useReducer } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotificationsData } from "../../redux/notificationsSlice";
import NotificationMiniItem from "./NotificationMiniItem";

const NotificationPopover = () => {
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
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
  useEffect(() => {
    console.log(notifications);
  }, [notifications]);
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
          <List.Item className="w-fulls">
            <NotificationMiniItem item={item} />
          </List.Item>
        )}
      />
      <Button className="w-full">Xem Tất Cả</Button>
    </div>
  );

  return (
    <Popover
      open={localState.openPopover}
      onOpenChange={handleOpenChange}
      title="Thông báo mới nhận"
      content={content}
    >
      <a href="#" className="flex items-center nav-link-hoverable gap-1">
        <Badge count={notifications.notSeen} size="small" showZero>
          <IoMdNotificationsOutline size={21} className="text-white" />
        </Badge>
        Thông báo
      </a>
    </Popover>
  );
};

export default memo(NotificationPopover);
