import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Empty,
  Input,
  message,
  Modal,
  Space,
  Spin,
} from "antd";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiTrash } from "react-icons/bi";
import { BsPinAngle } from "react-icons/bs";
import {
  MdOutlineMarkChatUnread,
  MdOutlineNotificationsOff,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { TbPinnedFilled } from "react-icons/tb";

import toast from "react-hot-toast";
import axios from "axios";
import {
  deleteConversation,
  getChattingUsers,
  markMessageAsNotRead,
  subscribeToMessages,
  subscribeToNewMessages,
  toggleMuteConversation,
  togglePinConversation,
} from "../../firebase/messageFirebase";
import { PiChatsDuotone } from "react-icons/pi";
import { TbPinnedOff } from "react-icons/tb";
import { MdNotificationsNone } from "react-icons/md";
import { MdOutlineMarkChatRead } from "react-icons/md";

// import { format } from "date-fns";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { useMessages } from "../../providers/MessagesProvider";
import { debounce } from "lodash";
const items = [
  {
    label: "Tất cả",
    key: "all",
  },
  {
    label: "Chưa đọc",
    key: "unread",
  },
  {
    label: "Đã Ghim",
    key: "pinned",
  },
];

const LeftChatBox = ({ onUserSelected, selectedUserRef }) => {
  //Redux state
  const user = useSelector((state) => state.user);
  const { state, handleUnsetUserSelected } = useMessages();
  //States
  const [loading, setLoading] = useState(false);
  const [openModalDeleteConversation, setOpenModalDeleteConversation] =
    useState(false);
  const conversationIdRef = useRef(null);
  const [allUser, setAllUser] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDropdownSortByLabel, setSelectedDropdownSortByLabel] =
    useState({
      label: "Tất cả",
      key: "all",
    });
  //Handlers

  const fetchChattingUsers = async () => {
    try {
      setLoading(true);
      const users = await getChattingUsers(
        user?.user_id,
        selectedDropdownSortByLabel.key,
        search
      );
      setAllUser(users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setAllUser([]);
      setLoading(false);
    }
  };

  const handleSelectedDropdownSortByLabel = useCallback(
    (e) => {
      const key = e.key;
      const label = e.domEvent.target.innerText;
      console.log(key);
      setSelectedDropdownSortByLabel({
        label,
        key,
      });
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
  const fetchChatting = async () => {
    try {
      const users = await getChattingUsers(
        user?.user_id,
        selectedDropdownSortByLabel.key,
        search
      );
      setAllUser(users);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = (conversation, e) => {
    e.domEvent.stopPropagation();
    switch (e.key) {
      case "0":
        console.log(conversation);
        markMessageAsNotRead(
          conversation.lastMessage?.id,
          user?.user_id,
          conversation?.lastMessage?.isRead,
          fetchChatting
        );
        break;
      case "1":
        togglePinConversation(
          conversation.conversationId,
          user?.user_id,
          conversation.isPinned,
          fetchChatting
        );
        break;
      case "2":
        toggleMuteConversation(
          conversation.conversationId,
          user?.user_id,
          conversation.isMuted,
          fetchChatting
        );
        break;
      case "3":
        handleOpenModalDeleteConversation(conversation.conversationId);
        break;
      default:
        break;
    }
  };
  const handleOpenModalDeleteConversation = (conversationId) => {
    conversationIdRef.current = conversationId;
    setOpenModalDeleteConversation(true);
  };

  const handleCloseModalDeleteConversation = () => {
    setOpenModalDeleteConversation(false);
    conversationIdRef.current = null;
  };

  const debouncedFetchChattingUsers = useCallback(
    debounce(fetchChattingUsers, 600),
    [search, selectedDropdownSortByLabel.key]
  );

  useEffect(() => {
    if (user?.user_id && state.openChatBox) {
      const unsubscribe = subscribeToNewMessages(user.user_id, fetchChatting);
      debouncedFetchChattingUsers();
      return () => {
        unsubscribe();
        debouncedFetchChattingUsers.cancel();
      };
    }
  }, [user, state.openChatBox, debouncedFetchChattingUsers]);

  const handleSearch = (text) => {
    setSearch(text);
  };

  return (
    <>
      <div className="left-chatbox">
        {/**Searchbar */}
        <div className="w-full flex items-center box-border px-3 py-2">
          <Input
            className="search-chatbox"
            prefix={<SearchOutlined className="text-slate-500" />}
            placeholder="Tìm kiếm"
            onChange={(e) => {
              handleSearch(e.target.value);
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
                {selectedDropdownSortByLabel.label}
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
              allUser.map((conversation, key) => {
                return (
                  <div
                    key={conversation?.userInfo?.user_id}
                    className="conversation-cell"
                    onClick={() => {
                      onUserSelected(conversation?.userInfo?.user_id);
                      setSearch("");
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
            ) : allUser.length > 0 ? (
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
                          <span
                            title={
                              conversation?.lastMessage?.mediaType === "image"
                                ? "Hình Ảnh"
                                : conversation?.lastMessage?.mediaType ===
                                  "video"
                                ? "Video"
                                : conversation?.lastMessage?.text
                            }
                          >
                            {conversation?.lastMessage?.mediaType ===
                            "image" ? (
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
                          {conversation?.isMuted && (
                            <div className="flex items-center">
                              <MdOutlineNotificationsOff />
                            </div>
                          )}
                          {conversation?.isPinned && (
                            <div className="flex items-center">
                              <TbPinnedFilled />
                            </div>
                          )}
                          <div className="conversation-cell-dropdown-options">
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    label: (
                                      <span className="flex items-center">
                                        {conversation?.lastMessage?.isRead ? (
                                          <>
                                            <MdOutlineMarkChatUnread className="text-[#888] mr-2" />
                                            <span>Đánh dấu chưa đọc</span>
                                          </>
                                        ) : (
                                          <>
                                            <MdOutlineMarkChatRead className="text-[#888] mr-2" />
                                            <span>Đánh dấu đã đọc</span>
                                          </>
                                        )}
                                      </span>
                                    ),
                                    key: "0",
                                  },
                                  {
                                    label: (
                                      <span className="flex items-center">
                                        {conversation?.isPinned ? (
                                          <>
                                            <TbPinnedOff className="text-[#888] mr-2" />{" "}
                                            <span>Bỏ Ghim trò chuyện</span>
                                          </>
                                        ) : (
                                          <>
                                            <BsPinAngle className="text-[#888] mr-2" />{" "}
                                            <span>Ghim trò chuyện</span>
                                          </>
                                        )}
                                      </span>
                                    ),
                                    key: "1",
                                  },
                                  {
                                    label: (
                                      <span className="flex items-center">
                                        {conversation?.isMuted ? (
                                          <>
                                            <MdNotificationsNone className="text-[#888] mr-2" />{" "}
                                            <span>Bật thông báo</span>
                                          </>
                                        ) : (
                                          <>
                                            <MdOutlineNotificationsOff className="text-[#888] mr-2" />{" "}
                                            <span>Tắt thông báo</span>
                                          </>
                                        )}
                                      </span>
                                    ),
                                    key: "2",
                                  },
                                  {
                                    label: (
                                      <span className="flex items-center">
                                        <BiTrash className="text-[#888] mr-2" />{" "}
                                        Xóa trò chuyện
                                      </span>
                                    ),
                                    key: "3",
                                  },
                                ],
                                onClick: (e) =>
                                  handleMenuClick(conversation, e),
                              }}
                              trigger={["click"]}
                              className="h-6 w-6 flex justify-center items-center"
                            >
                              <a
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
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
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <Empty description="Không có dữ liệu" />
              </div>
            ))}
        </div>
      </div>
      <Modal
        open={openModalDeleteConversation}
        title={
          <span className="text-2xl flex items-center gap-2">
            <IoIosWarning className="text-yellow-600" size={34} /> Xác nhận xóa
          </span>
        }
        footer={
          <div className="w-full flex justify-end gap-3 items-center">
            <Button
              className="hover:bg-secondary border-secondary text-secondary hover:text-white"
              onClick={() => handleCloseModalDeleteConversation()}
            >
              Hủy Bỏ
            </Button>
            <Button
              className="bg-primary border-primary text-white hover:opacity-80"
              onClick={async () => {
                await deleteConversation(conversationIdRef.current);
                await fetchChatting();
                message.success("Xóa trò chuyện thành công");
                handleUnsetUserSelected();

                handleCloseModalDeleteConversation();
              }}
            >
              Xác Nhận
            </Button>
          </div>
        }
      >
        <div className="text-lg text-[#666]">
          Bạn có chắc chắn muốn xóa trò chuyện này không?
        </div>
      </Modal>
    </>
  );
};

export default memo(LeftChatBox);
