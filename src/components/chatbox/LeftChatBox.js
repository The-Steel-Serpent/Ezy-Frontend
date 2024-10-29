import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Space, Spin } from "antd";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { BsPinAngle } from "react-icons/bs";
import {
  MdOutlineMarkChatUnread,
  MdOutlineNotificationsOff,
} from "react-icons/md";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import {
  getChattingUsers,
  subscribeToMessages,
  subscribeToNewMessages,
} from "../../firebase/messageFirebase";
// import { format } from "date-fns";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";

const items = [
  {
    label: "Tất cả",
    key: "0",
  },
  {
    label: "Chưa đọc",
    key: "1",
  },
  {
    label: "Đã Ghim",
    key: "2",
  },
];
const conversationOptions = [
  {
    label: (
      <span className="flex items-center">
        <MdOutlineMarkChatUnread className="text-[#888] mr-2" />
        <span>Đánh dấu chưa đọc</span>
      </span>
    ),
    key: "0",
  },
  {
    label: (
      <span className="flex items-center">
        <BsPinAngle className="text-[#888] mr-2" /> <span>Ghim trò chuyện</span>
      </span>
    ),
    key: "1",
  },
  {
    label: (
      <span className="flex items-center">
        <MdOutlineNotificationsOff className="text-[#888] mr-2" />{" "}
        <span>Tắt thông báo</span>
      </span>
    ),
    key: "2",
  },
  {
    label: (
      <span className="flex items-center">
        <BiTrash className="text-[#888] mr-2" /> Xóa trò chuyện
      </span>
    ),
    key: "3",
  },
];

const LeftChatBox = ({ onUserSelected, selectedUserRef }) => {
  //Redux state
  const user = useSelector((state) => state.user);

  //States
  const [loading, setLoading] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [selectedDropdownSortByLabel, setSelectedDropdownSortByLabel] =
    useState("Tất cả");
  //Handlers
  const handleSelectedDropdownSortByLabel = useCallback(
    (e) => {
      const label = e.domEvent.target.innerText;
      setSelectedDropdownSortByLabel(label);
    },
    [items]
  );
  const formatLastDay = useCallback((lastDay) => {
    if (!lastDay || !lastDay.seconds) return "";

    const today = new Date();
    const updatedDay = new Date(
      lastDay.seconds * 1000 + lastDay.nanoseconds / 1000000
    );

    const weekdays = [
      "Chủ nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];

    const timeDiff = today - updatedDay;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      return "Ngày hôm nay";
    }

    if (daysDiff === 1) {
      return "Ngày hôm qua";
    }

    if (daysDiff <= 7) {
      return weekdays[updatedDay.getDay()];
    }

    const day = updatedDay.getDate();
    const month = updatedDay.getMonth() + 1;
    return `${day}/${month}`;
  }, []);

  useEffect(() => {
    const fetchChatting = async () => {
      try {
        const users = await getChattingUsers(user?.user_id);
        setAllUser(users);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchChattingUsers = async () => {
      try {
        setLoading(true);
        const users = await getChattingUsers(user?.user_id);

        setAllUser(users);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (user?.user_id) {
      setLoading(true);
      fetchChattingUsers();
      setLoading(false);

      const unsubscribe = subscribeToNewMessages(user.user_id, fetchChatting);

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="left-chatbox">
      {/**Searchbar */}
      <div className="w-full flex items-center box-border px-3 py-2">
        <Input
          className="search-chatbox"
          prefix={<SearchOutlined className="text-slate-500" />}
          placeholder="Tìm kiếm"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        />
        <Dropdown
          menu={{
            items,
            onClick: handleSelectedDropdownSortByLabel,
          }}
          trigger={["click"]}
          className="ml-[18px] sort-by-label"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space className="text-[12px] w-max">
              {selectedDropdownSortByLabel}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      {/**ChatUser */}
      <div className="w-auto h-[2716px] max-w-56 max-h-[2716px] overflow-y-scroll custom-scrollbar relative">
        {search &&
          (loading ? (
            <div className="size-full flex justify-center items-center">
              <Spin className="text-primary" />
            </div>
          ) : (
            searchUser.map((user, key) => {
              return (
                <div
                  key={user?._id}
                  className="conversation-cell"
                  onClick={() => {
                    onUserSelected(user?._id);
                  }}
                >
                  <img
                    className="border-0 size-8 rounded-[50%]"
                    src={user.profile_pic}
                  />
                  <div className="flex-1 overflow-hidden flex ml-2 flex-col justify-center">
                    <div className="flex items-center justify-between overflow-hidden">
                      <div className="flex mr-2 overflow-hidden">
                        <div
                          title={user.username}
                          className="flex-1 text-[#333] text-base overflow-hidden whitespace-nowrap text-ellipsis  font-[500]"
                        >
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ))}
        {!search &&
          (loading ? (
            <div className="size-full flex justify-center items-center">
              <Spin className="text-primary" />
            </div>
          ) : (
            allUser.map((conversation, key) => {
              return (
                <div
                  key={conversation?.userInfo?.user_id}
                  className={`${
                    conversation?.userInfo?.user_id === selectedUserRef
                      ? "active"
                      : ""
                  } conversation-cell`}
                  onClick={() => {
                    onUserSelected(conversation?.userInfo?.user_id);
                  }}
                >
                  <img
                    className="border-0 size-8 rounded-[50%]"
                    src={
                      conversation?.userInfo?.role_id === 2
                        ? conversation?.userInfo?.Shop?.logo_url
                        : conversation?.userInfo?.avt_url
                    }
                    alt={
                      conversation?.userInfo?.role_id === 2
                        ? conversation?.userInfo?.Shop?.shop_name
                        : conversation?.userInfo?.username
                    }
                  />
                  <div className="flex-1 overflow-hidden flex ml-2 flex-col justify-center">
                    <div className="flex items-center justify-between overflow-hidden">
                      <div className="flex mr-2 overflow-hidden">
                        <div
                          title={
                            conversation?.userInfo?.role_id === 2
                              ? conversation?.userInfo?.Shop?.shop_name
                              : conversation?.userInfo?.username
                          }
                          className="flex-1 text-[#333] text-base overflow-hidden whitespace-nowrap text-ellipsis  font-[500]"
                        >
                          {conversation?.userInfo?.role_id === 2
                            ? conversation?.userInfo?.Shop?.shop_name
                            : conversation?.userInfo?.username}
                        </div>
                      </div>
                      <div className="text-[#666] text-xs whitespace-nowrap">
                        {formatLastDay(conversation?.lastMessage?.createdAt)}
                      </div>
                    </div>
                    <div className="chatting-text">
                      <div className="text-[#666] text-sm mr-2 overflow-hidden whitespace-nowrap text-ellipsis">
                        <span title="Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2">
                          {conversation?.lastMessage?.mediaType === "image" ? (
                            <span className="flex gap-1 items-center">
                              <FaImage />
                              Hình Ảnh
                            </span>
                          ) : conversation?.lastMessage?.mediaType ===
                            "video" ? (
                            <span className="flex gap-1 items-center">
                              <FaVideo />
                              Video
                            </span>
                          ) : (
                            conversation?.lastMessage?.text
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        {Boolean(conversation?.unseenCount) && (
                          <div className="flex items-center">
                            <div className="size-4 ml-1 p-0 items-center bg-primary rounded-lg text-white flex text-[12px] justify-center">
                              {conversation?.unseenCount}
                            </div>
                          </div>
                        )}

                        <div className="conversation-cell-dropdown-options">
                          <Dropdown
                            menu={{ items: conversationOptions }}
                            trigger={["click"]}
                            className="h-6 w-6 flex justify-center items-center"
                          >
                            <a onClick={(e) => e.preventDefault()}>
                              <Space className="text-base inline-block text-[#666] bg-transparent">
                                <DownOutlined className="text-sm" />
                              </Space>
                            </a>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ))}
      </div>
    </div>
  );
};

export default memo(LeftChatBox);
