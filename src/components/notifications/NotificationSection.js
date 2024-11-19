import { List, message } from "antd";
import React, { memo, useCallback, useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchNotificationsData } from "../../redux/notificationsSlice";
import NotificationMiniItem from "./NotificationMiniItem";
import { debounce, set } from "lodash";
import {
  fetchNotifications,
  markAsRead,
  markNotificationAsRead,
} from "../../services/notificationsService";
import VirtualList from "rc-virtual-list";
import { IoIosNotificationsOff } from "react-icons/io";

const NotificationSection = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      loading: false,
      notifications: [],
      page: 1,
      totalPages: 1,
    }
  );
  const { notifications, loading, page, totalPages } = localState;
  useEffect(() => {
    setLocalState((prevState) => ({
      ...prevState,
      notifications: [],
      page: 1,
    }));
  }, [type]);
  // Fetch initial notifications
  useEffect(() => {
    const getNotifications = async () => {
      setLocalState({ type: "loading", payload: true });
      try {
        const res = await fetchNotifications(user?.user_id, page, 7, type);
        console.log(res);
        if (res.success) {
          const updatedNotifications = [...notifications, ...res.data];
          setLocalState({
            type: "notifications",
            payload: updatedNotifications,
          });
          setLocalState({ type: "totalPages", payload: res.totalPages });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLocalState({ type: "loading", payload: false });
      }
    };
    if (user?.user_id && page && type) {
      getNotifications();
    }
  }, [user, page, type]);

  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 1) {
      if (page < totalPages) {
        setLocalState({
          type: "page",
          payload: page + 1,
        });
      }
    }
  };

  const handleMarkSAsRead = async () => {
    try {
      const res = await markAsRead(user?.user_id, type);
      if (res.success) {
        message.success("Đánh dấu đã đọc tất cả thông báo thành công");
        setLocalState({
          type: "notifications",
          payload: notifications.map((item) => {
            return { ...item, is_read: 1 };
          }),
        });
        dispatch(
          fetchNotificationsData({ userID: user?.user_id, page: 1, limit: 5 })
        );
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="w-full flex justify-end items-center p-5 border-[1px] border-solid">
        <span
          className="text-neutral-400 cursor-pointer"
          onClick={handleMarkSAsRead}
        >
          Đánh dấu Đã Đọc Tất Cả
        </span>
      </div>
      {notifications.length === 0 && !loading && (
        <div className="w-full flex justify-center items-center p-5 flex-col">
          <IoIosNotificationsOff className="text-[40px] text-primary" />
          <span>Không có thông báo nào</span>
        </div>
      )}
      {notifications.length > 0 && (
        <List>
          <VirtualList
            data={Array.isArray(notifications) ? notifications : []}
            itemHeight={105.07}
            height={600}
            onScroll={debounce(onScroll, 200)}
          >
            {(item) => {
              return (
                <List.Item
                  className={`w-full p-5 hover:bg-slate-100 cursor-pointer ${
                    item.is_read === 0 ? "bg-third" : ""
                  }`}
                >
                  <NotificationMiniItem item={item} />
                </List.Item>
              );
            }}
          </VirtualList>
        </List>
      )}
    </section>
  );
};

export default memo(NotificationSection);
