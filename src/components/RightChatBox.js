import { DownOutlined } from "@ant-design/icons";
import { Divider, Dropdown, Menu, Space, Spin, Switch } from "antd";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import { LuShoppingBag } from "react-icons/lu";
import { MdEventNote, MdOutlineEmojiEmotions } from "react-icons/md";
import { RiImage2Line, RiVideoLine } from "react-icons/ri";
import ImageChatbox from "./ImageChatbox";
import { IoClose } from "react-icons/io5";
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
const conversationDropdownItems = (props) => (
  <Menu className="hover-dropdown" style={{ padding: "16px", width: "215px" }}>
    <Menu.Item style={{ padding: "0px" }}>
      <div className="flex justify-start items-center gap-3 cursor-default">
        <img className="size-8 rounded-full" src={props.img} />
        <span className="text-base">{props.name}</span>
      </div>
    </Menu.Item>
    <Menu.Item style={{ padding: "0px" }}>
      <Divider className="mt-2 mb-0" />
    </Menu.Item>
    <Menu.Item style={{ padding: "8px 0px" }}>
      <div className="w-full flex justify-between">
        <span className="text-xs text-[#333]">Tắt thông báo</span>
        <Switch size="small" defaultChecked={false} />
      </div>
    </Menu.Item>
    <Menu.Item style={{ padding: "8px 0px" }}>
      <div className="w-full flex justify-between">
        <span className="text-xs text-[#333]">Chặn người dùng</span>
        <Switch size="small" defaultChecked={false} />
      </div>
    </Menu.Item>
    <Menu.Item style={{ padding: "8px 0px" }}>
      <div className="w-full flex justify-between items-center">
        <span className="text-xs text-[#333]">Tố cáo người dùng</span>
        <FaAngleRight className="text-[#999]" />
      </div>
    </Menu.Item>
    <Menu.Item style={{ padding: "0px" }}>
      <Divider className="mt-2 mb-0" />
    </Menu.Item>
    <Menu.Item style={{ padding: "8px 0px" }}>
      <div className="w-full flex justify-between items-center">
        <span className="text-xs text-[#333]">Xem thông tin cá nhân</span>
        <FaAngleRight className="text-[#999]" />
      </div>
    </Menu.Item>
  </Menu>
);
const RightChatBox = (props) => {
  //Redux State
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  //States
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    profile_pic: "",
  });
  const [allMessage, setAllMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownStickers, setOpenDropdownStickers] = useState(false);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const currMessage = useRef(null);
  //Handlers
  const onOpenDropdownStickersChange = useCallback(() => {
    setOpenDropdownStickers((preve) => {
      return !preve;
    });
  }, []);
  const handleOnChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setMessage((preve) => {
        return {
          ...preve,
          text: value,
        };
      });
    },
    [message]
  );

  const handleUploadFiles = useCallback(
    (e) => {
      const file = Array.from(e.target.files);

      setFiles((prevFile) => [...prevFile, ...file]);
    },
    [files]
  );

  const handleSendMessage = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);
      let updatedMessage = { ...message };
      setLoading(false);
      if (message.text || message.imgUrl || message.videoUrl) {
        if (socketConnection) {
          socketConnection.emit("new-message", {
            sender: user?._id,
            receiver: props.selectedUserID,
            text: updatedMessage.text,
            imageUrl: updatedMessage.imageUrl,
            videoUrl: updatedMessage.videoUrl,
            msgByUserID: user?._id,
          });

          setMessage({
            text: "",
            imageUrl: "",
            videoUrl: "",
          });
        }
      }
    },
    [message]
  );
  const handleFormatTime = useCallback((time) => {
    const date = new Date(time);

    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }, []);
  const handleRemoveFile = useCallback((key) => {
    setFiles((prevFileList) =>
      prevFileList.filter((_, index) => index !== key)
    );
  }, []);

  //Effects
  useEffect(() => {
    if (socketConnection) {
      setLoading(true);
      socketConnection.emit("message-section", props.selectedUserID);
      socketConnection.emit("seen", props.selectedUserID);
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      socketConnection.on("message", (data) => {
        console.log(data);
        console.log(user._id);
        console.log(props.selectedUserID);
        if (
          (data[data?.length - 1]?.msgByUserID === user._id &&
            data[data?.length - 1]?.reiceiverID === props.selectedUserID) ||
          (data[data?.length - 1]?.msgByUserID === props.selectedUserID &&
            data[data?.length - 1]?.reiceiverID === user._id)
        ) {
          // console.log("MsgByUserID", data[data?.length - 1]?.msgByUserID);
          // console.log("UserID", user._id);
          setAllMessage(data);
        }
      });

      setLoading(false);
    }
    return () => {
      socketConnection.off("message-section");
      socketConnection.off("message");
    };
  }, [user, props?.selectedUserID, socketConnection]);

  useEffect(() => {
    if (currMessage.current)
      currMessage.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [allMessage]);
  return (
    <div className={`${props.expandChatBox ? "" : "hidden"} right-chatbox `}>
      {/**Primary Bg Content */}
      {!dataUser._id && (
        <div className="w-full h-full bg-[#f3f3f3] flex justify-center items-center flex-col">
          <i class="h-[120px] w-[200px] inline-block" style={{ lineHeight: 0 }}>
            <svg
              width="200"
              height="120"
              viewBox="0 0 301 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 162C4.5 160.895 5.39543 160 6.5 160H282.5C283.605 160 284.5 160.895 284.5 162C284.5 163.105 283.605 164 282.5 164H6.5C5.39543 164 4.5 163.105 4.5 162Z"
                fill="#666666"
              ></path>
              <path
                d="M69.6355 28.0653C70.1235 21.8195 75.3341 17 81.5991 17H239.627C246.585 17 252.085 22.9 251.597 29.8417L243.5 145H60.5L69.6355 28.0653Z"
                fill="#B7B7B7"
              ></path>
              <path
                d="M78.2114 33.6879C78.3743 31.6062 80.1111 30 82.1992 30H237.212C239.531 30 241.363 31.9648 241.202 34.2776L233.5 145H69.5L78.2114 33.6879Z"
                fill="white"
              ></path>
              <path
                d="M56.5 148H243.5L243.171 149.973C242.207 155.759 237.201 160 231.334 160H56.5V148Z"
                fill="#666666"
              ></path>
              <path
                d="M27.5 150.4C27.5 149.075 28.5745 148 29.9 148H221.5C221.5 154.627 216.127 160 209.5 160H37.1C31.7981 160 27.5 155.702 27.5 150.4Z"
                fill="#B7B7B7"
              ></path>
              <path
                d="M96.5 148H152.5C152.5 151.866 149.366 155 145.5 155H103.5C99.634 155 96.5 151.866 96.5 148Z"
                fill="#666666"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M98.0769 44C94.933 44 92.3223 46.4267 92.0929 49.5621L89.9709 78.5621C89.7165 82.039 92.4687 85 95.9549 85H176.923C180.067 85 182.677 82.5733 182.907 79.4379L185.029 50.4379C185.283 46.961 182.531 44 179.045 44H98.0769ZM103.5 59.5C103.5 58.6716 104.171 58 105 58H166C166.828 58 167.5 58.6716 167.5 59.5C167.5 60.3284 166.828 61 166 61H105C104.171 61 103.5 60.3284 103.5 59.5ZM102.5 69.5C102.5 68.6716 103.171 68 104 68H141C141.828 68 142.5 68.6716 142.5 69.5C142.5 70.3284 141.828 71 141 71H104C103.171 71 102.5 70.3284 102.5 69.5Z"
                fill="#2673DD"
              ></path>
              <path
                d="M90.5 98.5C90.5 97.6716 91.1716 97 92 97H167C167.828 97 168.5 97.6716 168.5 98.5C168.5 99.3284 167.828 100 167 100H92C91.1716 100 90.5 99.3284 90.5 98.5Z"
                fill="#B7B7B7"
              ></path>
              <path
                d="M89.5 108.5C89.5 107.672 90.1716 107 91 107H152C152.828 107 153.5 107.672 153.5 108.5C153.5 109.328 152.828 110 152 110H91C90.1716 110 89.5 109.328 89.5 108.5Z"
                fill="#B7B7B7"
              ></path>
              <path
                d="M90 117C89.1716 117 88.5 117.672 88.5 118.5C88.5 119.328 89.1716 120 90 120H118C118.828 120 119.5 119.328 119.5 118.5C119.5 117.672 118.828 117 118 117H90Z"
                fill="#B7B7B7"
              ></path>
              <path
                d="M202.239 80C198.129 80 194.688 83.1144 194.279 87.204L193.266 97.3377L184.954 100.455C184.273 100.71 184.084 101.584 184.598 102.098L192.045 109.545L190.879 121.204C190.408 125.913 194.107 130 198.839 130H264.614C268.785 130 272.256 126.796 272.589 122.638L275.309 88.638C275.681 83.983 272.004 80 267.334 80H202.239Z"
                fill="#EE4D2D"
              ></path>
              <path
                d="M218 104C218 106.209 216.209 108 214 108C211.791 108 210 106.209 210 104C210 101.791 211.791 100 214 100C216.209 100 218 101.791 218 104Z"
                fill="white"
              ></path>
              <path
                d="M235 104C235 106.209 233.209 108 231 108C228.791 108 227 106.209 227 104C227 101.791 228.791 100 231 100C233.209 100 235 101.791 235 104Z"
                fill="white"
              ></path>
              <path
                d="M249 108C251.209 108 253 106.209 253 104C253 101.791 251.209 100 249 100C246.791 100 245 101.791 245 104C245 106.209 246.791 108 249 108Z"
                fill="white"
              ></path>
            </svg>
          </i>
          <div className="text-base mt-4 text-[#333] font-[500] my-2 select-none">
            Chào mừng bạn đến với Shopee Chat
          </div>
          <div>Bắt đầu trả lời người mua!</div>
        </div>
      )}

      {/**Conversation*/}
      {dataUser._id && (
        <div className="conversation">
          <div className="flex justify-start items-center h-full pl-3">
            <Dropdown
              overlay={conversationDropdownItems({
                name: dataUser.username,
                img: dataUser.profile_pic,
              })}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space className="text-sm text-[#333] whitespace-nowrap text-ellipsis overflow-hidden max-w-[248px] ">
                  {dataUser.username}
                  <DownOutlined className="text-[12px]" />
                </Space>
              </a>
            </Dropdown>
          </div>
          <div className="flex flex-col w-full relative">
            <div className="bg-[#f3f3f3] min-w-[6px] flex-1 border-t-[1px] border-solid border-[eee]">
              <div className="flex size-full flex-col">
                <div
                  className={`${
                    files.length === 0 ? "h-[330px]" : "h-[266px]"
                  }`}
                >
                  <div className="w-full h-full overflow-y-scroll custom-scrollbar">
                    {loading ? (
                      <div className="w-full h-full flex justify-center items-center ">
                        <Spin className="text-primary" />
                      </div>
                    ) : (
                      allMessage?.map((message) => {
                        return (
                          <div
                            className={`message-container ${
                              user?._id === message.msgByUserID
                                ? "sender"
                                : "receiver"
                            }`}
                            ref={currMessage}
                          >
                            <div className="message">
                              <span>{message?.text}</span>
                              <span className="text-[#666] text-xs text-end static">
                                {handleFormatTime(message?.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
            {files.length > 0 && (
              <section className="static w-full h-16 flex bg-white border-t-[1px] border-solid border-[#e4e6e8] box-border ">
                <div className="ml-[9px] flex flex-auto py-[9px] overflow-y-hidden box-border h-16 custom-scrollbar-x">
                  <div className="inline-flex items-center gap-[10px]">
                    <ImageChatbox
                      loading={loading}
                      setLoading={setLoading}
                      files={files}
                      handleRemoveFile={handleRemoveFile}
                    />
                    <label
                      className="size-[46px] border border-solid rounded border-[#eff2f4] flex justify-center items-center cursor-pointer"
                      title="Thêm hình ảnh/ video"
                    >
                      <input
                        accept="video/*,.flv,.3gp,.rm,.rmvb,.asf,.mp4,.webm,image/png,image/jpeg,image/jpg"
                        multiple
                        type="file"
                        className="hidden"
                        onChange={handleUploadFiles}
                      />
                      <FaPlus className="text-[#a09e9e]" size={12} />
                    </label>
                  </div>
                </div>
                <div
                  className="w-6 h-16 flex flex-col items-center flex-shrink-0 flex-grow-0 text-[#a09e9e] pt-1"
                  style={{ flexBasis: "auto" }}
                >
                  <IoClose
                    size={17}
                    onClick={() => {
                      setFiles([]);
                    }}
                  />
                </div>
              </section>
            )}
            <div className="min-h-[88px] border-t-[1px] border-sold border-[#e4e6e8] w-full z-[11]">
              <div className="size-full box-border relative">
                <div className="h-[88px] bg-white relative">
                  <div className="h-full flex flex-col justify-end">
                    <form
                      className="flex-1 overflow-y-auto p-2"
                      onSubmit={handleSendMessage}
                    >
                      <div className="flex flex-col w-full h-full">
                        <input
                          className="w-full flex-grow text-[#333] text-sm resize-none border-none outline-none box-border overflow-y-auto"
                          style={{ wordBreak: "break-word" }}
                          placeholder="Nhập nội dung tin nhắn"
                          onChange={handleOnChange}
                          value={message.text}
                        />
                      </div>
                      <div className="absolute right-2 bottom-[10px]">
                        <button
                          className={`${
                            message.text || message.imgUrl || message.videoUrl
                              ? "text-[#ee4d2d]"
                              : "text-[#ccc] pointer-events-none cursor-not-allowed"
                          } size-[18px]  transition-colors duration-200 ease-in`}
                          type="submit"
                          onSubmit={handleSendMessage}
                        >
                          <BiSend size={18} />
                        </button>
                      </div>
                    </form>
                    <div className="w-full h-[30px]">
                      <div className="flex h-full flex-row box-border flex-nowrap justify-between bg-white pb-[6px] pl-2">
                        <div className="flex flex-nowrap justify-start">
                          <div
                            className="flex justify-center items-center size-18 mr-2  cursor-pointer"
                            title="Stickers"
                          >
                            <Dropdown
                              menu={{ items }}
                              placement="top"
                              open={openDropdownStickers}
                              onOpenChange={onOpenDropdownStickersChange}
                              trigger={["click"]}
                              className={`${
                                openDropdownStickers
                                  ? "text-[#ee4d2d]"
                                  : "text-[#8ea4d1]"
                              } transition-colors duration-200 `}
                            >
                              <MdOutlineEmojiEmotions size={18} />
                            </Dropdown>
                          </div>
                          <div
                            className="flex justify-center items-center size-18 mr-2 transition-colors duration-200 text-[#8ea4d1] "
                            title="Hình ảnh"
                          >
                            <label>
                              <input
                                type="file"
                                className="hidden"
                                id="uploadImage"
                                name="uploadImage"
                                onChange={handleUploadFiles}
                                multiple
                              />
                              <RiImage2Line
                                className="cursor-pointer"
                                size={18}
                              />
                            </label>
                          </div>
                          <div
                            className="flex justify-center items-center size-18 mr-2 transition-colors duration-200 text-[#8ea4d1] "
                            title="Video"
                          >
                            <label>
                              <input
                                type="file"
                                className="hidden"
                                id="uploadVideo"
                                name="uploadVideo"
                                onChange={handleUploadFiles}
                                multiple
                              />
                              <RiVideoLine
                                className="cursor-pointer"
                                size={18}
                              />
                            </label>
                          </div>
                          <div
                            className="flex justify-center items-center size-18 mr-2 transition-colors duration-200 text-[#8ea4d1] cursor-pointer"
                            title="Sản phẩm"
                          >
                            <LuShoppingBag size={18} />
                          </div>
                          <div
                            className="flex justify-center items-center size-18 mr-2 transition-colors duration-200 text-[#8ea4d1] cursor-pointer"
                            title="Đơn hàng"
                          >
                            <MdEventNote size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RightChatBox);
