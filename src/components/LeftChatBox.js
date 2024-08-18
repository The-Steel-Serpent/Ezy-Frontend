import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import { Dropdown, Input, Space } from "antd";
import React, { memo, useCallback, useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { BsPinAngle } from "react-icons/bs";
import {
  MdOutlineMarkChatUnread,
  MdOutlineNotificationsOff,
} from "react-icons/md";
import { useSelector } from "react-redux";
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
const conversations = [
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
  {
    img: "https://cf.shopee.vn/file/0053f6d0c7990dbeac4b71ad498ac9e2_tn",
    name: "razervietnam",
    msg: "Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2",
    date: "Ngày hôm qua",
  },
];
const LeftChatBox = () => {
  //Redux state
  const user = useSelector((state) => state.user);
  const socketConnection = useSelector((state) => state?.socketConnection);

  //States
  const [allUser, setAllUser] = useState([]);
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

  //Effects
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user?._id);
      socketConnection.on("conversation", (data) => {
        const conversationUserData = data.map((conversationUser, index) => {
          //Sender/Receiver is me
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (
            conversationUser?.receiver?._id !== conversationUser?.sender?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [user, socketConnection]);

  return (
    <div className="left-chatbox">
      {/**Searchbar */}
      <div className="w-full flex items-center box-border px-3 py-2">
        <Input
          className="search-chatbox"
          prefix={<SearchOutlined className="text-slate-500" />}
          placeholder="Tìm kiếm"
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
        {allUser.map((conversation, key) => {
          return (
            <div key={key} className="conversation-cell">
              <img
                className="border-0 size-8 rounded-[50%]"
                src={conversation?.userDetails?.profile_pic}
              />
              <div className="flex-1 overflow-hidden flex ml-2 flex-col justify-center">
                <div className="flex items-center justify-between overflow-hidden">
                  <div className="flex mr-2 overflow-hidden">
                    <div
                      title="razervietnam"
                      className="flex-1 text-[#333] text-base overflow-hidden whitespace-nowrap text-ellipsis  font-[500]"
                    >
                      {conversation?.userDetails?.name}
                    </div>
                  </div>
                  <div className="text-[#666] text-xs whitespace-nowrap">
                    18/8
                  </div>
                </div>
                <div className="chatting-text">
                  <div className="text-[#666] text-sm mr-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    <span title="Chúc mừng bạn đã nhận được một chuột Razer Deathadder Essential V2">
                      {conversation?.lastMsg?.text}
                    </span>
                  </div>

                  <div className="conversation-cell-dropdown-options">
                    <Dropdown
                      menu={{ items: conversationOptions }}
                      trigger={["click"]}
                      className="h-6 w-6 flex justify-center items-center p-4"
                    >
                      <a onClick={(e) => e.preventDefault()}>
                        <Space className="text-base inline-block text-[#666]">
                          <DownOutlined className="text-sm" />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(LeftChatBox);
